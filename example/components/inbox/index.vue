<template>
  <div>
    <h2>inbox! {{message.text}}</h2>
    <router-view></router-view>
  </div>
</template>

<script>
var messagesSerivce = require('../../services/messages')

module.exports = {
  route: {

    // three options:
    // 1. return a boolean
    // 2. return a promise that resolves to a boolean
    // 3. explicitly call transition.next() or abort()
    canActivate: function (transition) {
      if (transition.from.path === '/about') {
        alert('cannot navigate from /about to /inbox')
        transition.abort()
      } else {
        transition.next()
      }
    },

    // for async data loading.
    // sets the component's "$loading" meta property to true when called,
    // and sets it to false when resolved.
    // two options:
    // 1. return a promise
    // 2. explicitly call transition.resolve() or
    //     transition.abort(reason)
    activate: function (transition) {
      // "this" is available
      var params = transition.to.params.messageId

      // callback based
      messagesSerivce.get(params, function (err, message) {
        if (err) {
          transition.abort(err)
        } else {
          transition.next({
            message: message
          })
        }
      })

      // or promise based (with ES6 sugar)
      // return messagesSerivce
      //   .get(params)
      //   .then(message => ({ message }))
    },

    // same deal with beforeActicate
    canDeactivate: function (transition) {
      console.log('inbox canDeactivate')
      return true
    },

    // for doing cleanups
    deactivate: function (transition) {
      console.log('inbox deactivate')
      transition.next()
    }
  },

  data: function () {
    return {
      message: {}
    }
  }
}
</script>
