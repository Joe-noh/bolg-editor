const preprocess = require('svelte-preprocess')
const autoprefixer = require('autoprefixer')

module.exports = {
  preprocess: preprocess({
    scss: {
      includePaths: ['./src/styles'],
    },
    postcss: {
      plugins: [autoprefixer],
    },
  }),
}
