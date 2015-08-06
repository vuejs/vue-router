<template>
  <div>
    <h2>inbox! {{message.text}}</h2>
    <router-view></router-view>
  </div>
</template>

<script>
module.exports = {
  route: {

    // three options:
    // 1. return a boolean
    // 2. return a promise that resolves to a boolean
    // 3. explicitly call transition.next() or abort()
    canActivate: function (transition) {
      console.log('inbox canActivate?')
      if (transition.from.path === '/about') {
        alert('cannot navigate from /about to /inbox')
        transition.abort()
      } else {
        console.log('yes')
        transition.next()
      }
    },

    // same deal with beforeActicate
    canDeactivate: function (transition) {
      console.log('inbox canDeactivate?')
      console.log('yes')
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
