(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global['bolg-editor'] = {}));
}(this, (function (exports) { 'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if (typeof $$scope.dirty === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    /* src/layouts/Container.svelte generated by Svelte v3.16.7 */

    function add_css() {
    	var style = element("style");
    	style.id = "svelte-122jbc9-style";
    	style.textContent = ".padding-s.svelte-122jbc9{padding:var(--bolg-spacer-s, 8px)}.padding-m.svelte-122jbc9{padding:var(--bolg-spacer-m, 16px)}.padding-l.svelte-122jbc9{padding:var(--bolg-spacer-l, 24px)}";
    	append(document.head, style);
    }

    function create_fragment(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	return {
    		c() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr(div, "class", div_class_value = "" + (null_to_empty(`padding-${/*padding*/ ctx[0]}`) + " svelte-122jbc9"));
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot && default_slot.p && dirty & /*$$scope*/ 2) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[1], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null));
    			}

    			if (!current || dirty & /*padding*/ 1 && div_class_value !== (div_class_value = "" + (null_to_empty(`padding-${/*padding*/ ctx[0]}`) + " svelte-122jbc9"))) {
    				attr(div, "class", div_class_value);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let { padding = "m" } = $$props;
    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ("padding" in $$props) $$invalidate(0, padding = $$props.padding);
    		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	return [padding, $$scope, $$slots];
    }

    class Container extends SvelteComponent {
    	constructor(options) {
    		super();
    		if (!document.getElementById("svelte-122jbc9-style")) add_css();
    		init(this, options, instance, create_fragment, safe_not_equal, { padding: 0 });
    	}
    }

    /* src/layouts/Stack.svelte generated by Svelte v3.16.7 */

    function add_css$1() {
    	var style = element("style");
    	style.id = "svelte-1rsob8l-style";
    	style.textContent = ".stack.svelte-1rsob8l{display:grid}.gap-s.svelte-1rsob8l{gap:var(--bolg-spacer-s, 8px)}.gap-m.svelte-1rsob8l{gap:var(--bolg-spacer-m, 16px)}.gap-l.svelte-1rsob8l{gap:var(--bolg-spacer-l, 24px)}";
    	append(document.head, style);
    }

    function create_fragment$1(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	return {
    		c() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr(div, "class", div_class_value = "stack " + `gap-${/*gap*/ ctx[0]}` + " svelte-1rsob8l");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot && default_slot.p && dirty & /*$$scope*/ 2) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[1], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null));
    			}

    			if (!current || dirty & /*gap*/ 1 && div_class_value !== (div_class_value = "stack " + `gap-${/*gap*/ ctx[0]}` + " svelte-1rsob8l")) {
    				attr(div, "class", div_class_value);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { gap = "m" } = $$props;
    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ("gap" in $$props) $$invalidate(0, gap = $$props.gap);
    		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	return [gap, $$scope, $$slots];
    }

    class Stack extends SvelteComponent {
    	constructor(options) {
    		super();
    		if (!document.getElementById("svelte-1rsob8l-style")) add_css$1();
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { gap: 0 });
    	}
    }

    /* src/elements/Text.svelte generated by Svelte v3.16.7 */

    function add_css$2() {
    	var style = element("style");
    	style.id = "svelte-c6jvxj-style";
    	style.textContent = ".text.svelte-c6jvxj{color:var(--bolg-text-color, #222222)}.font-sans.svelte-c6jvxj{font-family:var(--bolg-font-family-sans, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\")}.font-serif.svelte-c6jvxj{font-family:var(--bolg-font-family-serif, Georgia, Cambria, \"Times New Roman\", Times, serif)}.font-mono.svelte-c6jvxj{font-family:var(--bolg-font-family-mono, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace)}";
    	append(document.head, style);
    }

    function create_fragment$2(ctx) {
    	let span;
    	let span_class_value;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	return {
    		c() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			attr(span, "class", span_class_value = "text " + `font-${/*font*/ ctx[0]}` + " svelte-c6jvxj");
    		},
    		m(target, anchor) {
    			insert(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot && default_slot.p && dirty & /*$$scope*/ 2) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[1], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null));
    			}

    			if (!current || dirty & /*font*/ 1 && span_class_value !== (span_class_value = "text " + `font-${/*font*/ ctx[0]}` + " svelte-c6jvxj")) {
    				attr(span, "class", span_class_value);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(span);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { font = "sans" } = $$props;
    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ("font" in $$props) $$invalidate(0, font = $$props.font);
    		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	return [font, $$scope, $$slots];
    }

    class Text extends SvelteComponent {
    	constructor(options) {
    		super();
    		if (!document.getElementById("svelte-c6jvxj-style")) add_css$2();
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { font: 0 });
    	}
    }

    /* src/elements/Heading.svelte generated by Svelte v3.16.7 */

    function add_css$3() {
    	var style = element("style");
    	style.id = "svelte-jp3yo6-style";
    	style.textContent = ".heading.svelte-jp3yo6{margin:0;color:var(--bolg-text-color, #222222);font-family:var(--bolg-font-family-sans, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\");font-weight:bold}.heading--1.svelte-jp3yo6{font-size:var(--bolg-heading-font-size-1, 28px)}.heading--2.svelte-jp3yo6{font-size:var(--bolg-heading-font-size-2, 24px)}.heading--3.svelte-jp3yo6{font-size:var(--bolg-heading-font-size-3, 20px)}.heading--4.svelte-jp3yo6{font-size:var(--bolg-heading-font-size-4, 18px)}.heading--5.svelte-jp3yo6{font-size:var(--bolg-heading-font-size-5, 16px)}";
    	append(document.head, style);
    }

    // (23:29) 
    function create_if_block_4(ctx) {
    	let h5;
    	let h5_class_value;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	return {
    		c() {
    			h5 = element("h5");
    			if (default_slot) default_slot.c();
    			attr(h5, "class", h5_class_value = "heading " + `heading--${/*headingLevel*/ ctx[0]}` + " svelte-jp3yo6");
    		},
    		m(target, anchor) {
    			insert(target, h5, anchor);

    			if (default_slot) {
    				default_slot.m(h5, null);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot && default_slot.p && dirty & /*$$scope*/ 4) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[2], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null));
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(h5);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    // (19:29) 
    function create_if_block_3(ctx) {
    	let h4;
    	let h4_class_value;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	return {
    		c() {
    			h4 = element("h4");
    			if (default_slot) default_slot.c();
    			attr(h4, "class", h4_class_value = "heading " + `heading--${/*headingLevel*/ ctx[0]}` + " svelte-jp3yo6");
    		},
    		m(target, anchor) {
    			insert(target, h4, anchor);

    			if (default_slot) {
    				default_slot.m(h4, null);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot && default_slot.p && dirty & /*$$scope*/ 4) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[2], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null));
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(h4);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    // (15:29) 
    function create_if_block_2(ctx) {
    	let h3;
    	let h3_class_value;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	return {
    		c() {
    			h3 = element("h3");
    			if (default_slot) default_slot.c();
    			attr(h3, "class", h3_class_value = "heading " + `heading--${/*headingLevel*/ ctx[0]}` + " svelte-jp3yo6");
    		},
    		m(target, anchor) {
    			insert(target, h3, anchor);

    			if (default_slot) {
    				default_slot.m(h3, null);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot && default_slot.p && dirty & /*$$scope*/ 4) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[2], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null));
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(h3);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    // (11:29) 
    function create_if_block_1(ctx) {
    	let h2;
    	let h2_class_value;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	return {
    		c() {
    			h2 = element("h2");
    			if (default_slot) default_slot.c();
    			attr(h2, "class", h2_class_value = "heading " + `heading--${/*headingLevel*/ ctx[0]}` + " svelte-jp3yo6");
    		},
    		m(target, anchor) {
    			insert(target, h2, anchor);

    			if (default_slot) {
    				default_slot.m(h2, null);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot && default_slot.p && dirty & /*$$scope*/ 4) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[2], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null));
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(h2);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    // (7:0) {#if headingLevel === 1}
    function create_if_block(ctx) {
    	let h1;
    	let h1_class_value;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	return {
    		c() {
    			h1 = element("h1");
    			if (default_slot) default_slot.c();
    			attr(h1, "class", h1_class_value = "heading " + `heading--${/*headingLevel*/ ctx[0]}` + " svelte-jp3yo6");
    		},
    		m(target, anchor) {
    			insert(target, h1, anchor);

    			if (default_slot) {
    				default_slot.m(h1, null);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot && default_slot.p && dirty & /*$$scope*/ 4) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[2], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null));
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(h1);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function create_fragment$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;

    	const if_block_creators = [
    		create_if_block,
    		create_if_block_1,
    		create_if_block_2,
    		create_if_block_3,
    		create_if_block_4
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*headingLevel*/ ctx[0] === 1) return 0;
    		if (/*headingLevel*/ ctx[0] === 2) return 1;
    		if (/*headingLevel*/ ctx[0] === 3) return 2;
    		if (/*headingLevel*/ ctx[0] === 4) return 3;
    		if (/*headingLevel*/ ctx[0] === 5) return 4;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	return {
    		c() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if_block.p(ctx, dirty);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { level = 1 } = $$props;
    	const headingLevel = +level;
    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ("level" in $$props) $$invalidate(1, level = $$props.level);
    		if ("$$scope" in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	return [headingLevel, level, $$scope, $$slots];
    }

    class Heading extends SvelteComponent {
    	constructor(options) {
    		super();
    		if (!document.getElementById("svelte-jp3yo6-style")) add_css$3();
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { level: 1 });
    	}
    }

    /* src/elements/Button.svelte generated by Svelte v3.16.7 */

    function add_css$4() {
    	var style = element("style");
    	style.id = "svelte-awgdmu-style";
    	style.textContent = ".button.svelte-awgdmu{cursor:pointer;border:none;font-weight:500;font-size:14px;padding:8px 16px;min-width:100px}.type-filled.svelte-awgdmu{border:none}.type-filled.tone-info.svelte-awgdmu{color:white;background-color:var(--bolg-info-color, #209cee);border:solid 2px var(--bolg-info-color, #209cee)}.type-filled.tone-success.svelte-awgdmu{color:white;background-color:var(--bolg-success-color, #48bb78);border:solid 2px var(--bolg-success-color, #48bb78)}.type-filled.tone-warning.svelte-awgdmu{color:var(--bolg-text-color, #222222);background-color:var(--bolg-warning-color, #f9db59);border:solid 2px var(--bolg-warning-color, #f9db59)}.type-filled.tone-critical.svelte-awgdmu{color:white;background-color:var(--bolg-critical-color, #ef3d3d);border:solid 2px var(--bolg-critical-color, #ef3d3d)}.type-filled.tone-info.svelte-awgdmu:disabled,.type-filled.tone-success.svelte-awgdmu:disabled,.type-filled.tone-warning.svelte-awgdmu:disabled,.type-filled.tone-critical.svelte-awgdmu:disabled{color:white;background-color:var(--bolg-disabled-color, #999999);border:solid 2px var(--bolg-disabled-color, #999999)}.type-outlined.svelte-awgdmu{background-color:white}.type-outlined.tone-info.svelte-awgdmu{color:var(--bolg-info-color, #209cee);border:solid 2px var(--bolg-info-color, #209cee)}.type-outlined.tone-success.svelte-awgdmu{color:var(--bolg-success-color, #48bb78);border:solid 2px var(--bolg-success-color, #48bb78)}.type-outlined.tone-warning.svelte-awgdmu{color:var(--bolg-warning-color, #f9db59);border:solid 2px var(--bolg-warning-color, #f9db59)}.type-outlined.tone-critical.svelte-awgdmu{color:var(--bolg-critical-color, #ef3d3d);border:solid 2px var(--bolg-critical-color, #ef3d3d)}.type-outlined.tone-info.svelte-awgdmu:disabled,.type-outlined.tone-success.svelte-awgdmu:disabled,.type-outlined.tone-warning.svelte-awgdmu:disabled,.type-outlined.tone-critical.svelte-awgdmu:disabled{color:var(--bolg-disabled-color, #999999);border:solid 2px var(--bolg-disabled-color, #999999)}";
    	append(document.head, style);
    }

    function create_fragment$4(ctx) {
    	let button;
    	let button_class_value;
    	let current;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	return {
    		c() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr(button, "class", button_class_value = "button " + `tone-${/*tone*/ ctx[0]}` + " " + `type-${/*type*/ ctx[1]}` + " svelte-awgdmu");
    			button.disabled = /*disabled*/ ctx[2];
    			dispose = listen(button, "click", /*click_handler*/ ctx[5]);
    		},
    		m(target, anchor) {
    			insert(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot && default_slot.p && dirty & /*$$scope*/ 8) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[3], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null));
    			}

    			if (!current || dirty & /*tone, type*/ 3 && button_class_value !== (button_class_value = "button " + `tone-${/*tone*/ ctx[0]}` + " " + `type-${/*type*/ ctx[1]}` + " svelte-awgdmu")) {
    				attr(button, "class", button_class_value);
    			}

    			if (!current || dirty & /*disabled*/ 4) {
    				button.disabled = /*disabled*/ ctx[2];
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(button);
    			if (default_slot) default_slot.d(detaching);
    			dispose();
    		}
    	};
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { tone = "info" } = $$props;
    	let { type = "filled" } = $$props;
    	let { disabled = false } = $$props;
    	let { $$slots = {}, $$scope } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("tone" in $$props) $$invalidate(0, tone = $$props.tone);
    		if ("type" in $$props) $$invalidate(1, type = $$props.type);
    		if ("disabled" in $$props) $$invalidate(2, disabled = $$props.disabled);
    		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	return [tone, type, disabled, $$scope, $$slots, click_handler];
    }

    class Button extends SvelteComponent {
    	constructor(options) {
    		super();
    		if (!document.getElementById("svelte-awgdmu-style")) add_css$4();
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { tone: 0, type: 1, disabled: 2 });
    	}
    }

    exports.Button = Button;
    exports.Container = Container;
    exports.Heading = Heading;
    exports.Stack = Stack;
    exports.Text = Text;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
