// just a mock
module.exports = {
  get: function (params, cb) {
    setTimeout(function () {
      cb(null, {
        id: params.id,
        text: 'Hello this is a message'
      })
    }, 1000)
  }
}
