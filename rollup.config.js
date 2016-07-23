const buble = require('rollup-plugin-buble')
const babel = require('rollup-plugin-babel')
const cjs = require('rollup-plugin-commonjs')
const node = require('rollup-plugin-node-resolve')
const replace = require('rollup-plugin-replace')

module.exports = {
  entry: 'src/index.js',
  dest: 'dist/vue-router.js',
  format: 'umd',
  moduleName: 'VueRouter',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    node(),
    cjs(),
    buble()
  ]
}
