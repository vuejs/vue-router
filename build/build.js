var fs = require('fs')
var rollup = require('rollup')
var uglify = require('uglify-js')
var babel = require('rollup-plugin-babel')
var version = process.env.VERSION || require('../package.json').version
var banner =
  '/*!\n' +
  ' * vue-router v' + version + '\n' +
  ' * (c) ' + new Date().getFullYear() + ' Evan You\n' +
  ' * Released under the MIT License.\n' +
  ' */'

rollup.rollup({
  entry: 'src/index.js',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      loose: 'all',
      sourceMap: true
    })
  ]
}).then(function (bundle) {
  bundle.write({
    format: 'cjs',
    dest: 'dist/vue-router.common.js'
  }).then(function () {
    console.log('built: dist/vue-router.common.js')
  })
  return bundle.write({
    format: 'umd',
    banner: banner,
    moduleName: 'VueRouter',
    sourceMap: true,
    dest: 'dist/vue-router.js'
  })
}).then(function () {
  console.log('built: ' + 'dist/vue-router.js')
  fs.writeFile(
    'dist/vue-router.min.js',
    banner + '\n' + uglify.minify('dist/vue-router.js').code,
    function (err) {
      if (err) throw err
      console.log('built: ' + 'dist/vue-router.min.js')
    }
  )
}).catch(function (e) {
  console.log(e)
})
