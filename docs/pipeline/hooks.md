# Transition Hooks

A `<router-view>` component involved in a transition can control / react to the transition by implementing appropriate transition pipeline hooks. These hooks include:

- `data`
- `activate`
- `deactivate`
- `canActivate`
- `canDeactivate`
- `canReuse`

You can implement these hooks under your component's `route` option:

``` js
Vue.component('hook-example', {
  // ... other options
  route: {
    activate: function (transition) {
      console.log('hook-example activated!')
      transition.next()
    },
    deactivate: function (transition) {
      console.log('hook-example deactivated!')
      transition.next()
    }
  }
})
```

### The Transition Object

Each transition hook will receive a `transition` object as the only argument. The transition object exposes the following properties & methods:

- **transition.from**

  A [route object](../route.html) representing the route we are transitioning from.

- **transition.to**

  A route object representing the target path.

- **transition.next()**

  Call this method to progress to the next step of the transition.

- **transition.abort([reason])**

  Call this method to cancel / reject the transition.

- **transition.redirect(path)**

  Cancel current transition and redirect to a different target route instead.

All transition hooks are considered asynchronous by default. In order to signal the transition to progress, you have three options:

1. Explicitly call one of `next`, `abort` or `redirect`.

2. Return a Promise. Details below.

3. For validation hooks (`canActivate` and `canDeactivate`), you can synchronously return a Boolean value.

### Returning Promise in Hooks

When you return a Promise in a transition hook, `transition.next` will be called for you when the Promise resolves. If the Promise is rejected during validation phase, it will call `transition.abort`; if it is rejected during activation phase, it will call `transition.next`.

For validation hooks (`canActivate` and `canDeactivate`), if the Promise's resolved value is falsy, it will also abort the transition.

If a rejected promise has an uncaught error, it will be thrown unless you suppress it with the `suppressTransitionError` option when creating the router.

**Example:**

``` js
// inside component definition
route: {
  canActivate: function () {
    // assuming the service returns a Promise that
    // resolve to either `true` or `false`.
    return authenticationService.isLoggedIn()
  },
  activate: function (transition) {
    return messageService
      .fetch(transition.to.params.messageId)
      .then((message) => {
        // set the data once it arrives.
        // the component will not display until this
        // is done.
        this.message = message
      })
  }
}
```

We are asynchronously fetching data in the `activate` hook here just for the sake of an example; Note that we also have the [`data` hook](data.html) which is in general more appropriate for this purpose.

**TIP:** if you are using ES6 you can use argument destructuring to make your hooks cleaner:

``` js
route: {
  activate ({ next }) {
    // when done:
    next()
  }
}
```

Check out the [advanced example](https://github.com/vuejs/vue-router/tree/dev/example/advanced) in the vue-router repo.
