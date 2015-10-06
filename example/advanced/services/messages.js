// just a mock
export default {
  get (params, cb) {
    setTimeout(() => {
      cb(null, {
        id: params.id,
        text: 'Hello this is a message'
      })
    }, 3000)
  }
}
