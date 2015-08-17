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
    canActivate (transition) {
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
    canDeactivate (transition) {
      return confirm('Are you sure you want to leave inbox?')
    },

    // activate hook is called when the route is matched
    // and the component has been created.
    // this hook controls the timing of the component
    // switching - the switching won't start until this
    // hook is resolved.
    activate () {
      console.log('activating inbox...')
      return new Promise((resolve) => {
        console.log('inbox activated.')
        resolve()
      })
    },

    // for doing cleanups
    // destructuring can make hooks cleaner
    deactivate ({ next }) {
      console.log('inbox deactivated.')
      next()
    }
  },

  data () {
    return {
      message: {}
    }
  }
}
</script>
