<template>
  <div>
    <div v-if="$loadingRouteData">Loading data...</div>
    <div v-if="!$loadingRouteData">message #{{message.id}}: {{message.text}}</div>
  </div>
</template>

<script>
var messagesSerivce = require('../../services/messages')

module.exports = {
  route: {
    // data hook
    // Useful for doing async data loading.
    // sets the component's "$loading" property to
    // true when called, and sets it to false when resolved.
    // two options:
    // 1. return a promise
    // 2. explicitly call transition.next() or
    //     transition.abort(reason)
    data: function (transition) {
      // "this" is available
      var params = {
        id: transition.to.params.messageId
      }

      // callback based
      messagesSerivce.get(params, function (err, message) {
        if (err) {
          // handle error, e.g. display a warning
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
    }
  },

  // default state
  data: function () {
    return {
      message: {}
    }
  }
}
</script>
