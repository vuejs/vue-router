var version =
  process.env.VERSION ||
  require('../package.json').version

module.exports =
  'vue-router v' + version + '\n' +
  '(c) ' + new Date().getFullYear() + ' Evan You\n' +
  'Released under the MIT License.'
