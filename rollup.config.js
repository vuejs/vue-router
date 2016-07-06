const buble = require('rollup-plugin-buble')
const cjs = require('rollup-plugin-commonjs')
const node = require('rollup-plugin-node-resolve')
const replace = require('rollup-plugin-replace')

module.exports = {
  entry: 'src/index.js',
  dest: 'dist/vue-router.js',
  format: 'umd',
  moduleName: 'VueRouter',
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    node(),
    cjs(),
    buble()
  ]
}
