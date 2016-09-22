const buble = require('rollup-plugin-buble')
const flow = require('rollup-plugin-flow-no-whitespace')
const cjs = require('rollup-plugin-commonjs')
const node = require('rollup-plugin-node-resolve')
const replace = require('rollup-plugin-replace')
const version = process.env.VERSION || require('../package.json').version

const replaceConfig = {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
}

module.exports = {
  entry: 'src/index.js',
  dest: 'dist/vue-router.js',
  format: 'umd',
  moduleName: 'VueRouter',
  plugins: [flow(), replace(replaceConfig), node(), cjs(), buble()],
  banner:
`/**
 * vue-router v${version}
 * (c) ${new Date().getFullYear()} Evan You
 * @license MIT
 */`
}
