import { spawn } from 'child_process'
import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import pkg from './package.json'

function serve() {
  let started = false

  return {
    writeBundle() {
      if (!started) {
        started = true

        spawn('npm', ['run', 'serve'], {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true,
        })
      }
    },
  }
}

export default [
  {
    input: 'src/index.js',
    output: [
      { file: pkg.module, format: 'es' },
      { file: pkg.main, format: 'umd', name: pkg.name },
    ],
    plugins: [svelte(), resolve()],
    watch: {
      clearScreen: false,
    },
  },
  {
    input: 'src/preview/index.js',
    output: {
      file: 'public/bundle.js',
      format: 'iife',
      name: 'preview',
    },
    plugins: [svelte({ dev: true }), resolve({ browser: true }), serve()],
  },
]
