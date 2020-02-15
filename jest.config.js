const { preprocess } = require('./svelte.config.js')

module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.svelte$': ['jest-transform-svelte', { preprocess }],
  },
  moduleFileExtensions: ['js', 'svelte'],
}
