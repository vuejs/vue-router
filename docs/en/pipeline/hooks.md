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
    activate: function () {
      console.log('hook-example activated!')
    },
    canDeactivate: function (transition) {
      console.log('You are not allowed to leave.')
      transition.abort()
    }
  }
})
```

### Transition Object

Each transition hook will receive a `transition` object as the only argument. The transition object exposes the following properties & methods:

- **transition.from**

  A [route object](../route.md) representing the route we are transitioning from.

- **transition.to**

  A route object representing the target path.

- **transition.next()**

  Call this method to progress to the next step of the transition.

- **transition.abort([reason])**

  Call this method to cancel / reject the transition.

- **transition.redirect(path)**

  Cancel current transition and redirect to a different target route instead.

### Hook Resolution Rules

We often need to perform asynchronous tasks inside transition hooks. The transition will not proceed until an asynchronous hook has been resolved.  Here are the rules to determine when a hook should be considered resolved:

1. If the hook returns a Promise, the hook will be resolved when the Promise is resolved. [See details below](#returning-promise-in-hooks).

2. If the hook doesn't return a Promise, and doesn't expect any argument, it is resolved synchronously. For example:

  ``` js
  route: {
    activate: function (/* no argument here */) {
      // will resolve synchronously as long as not returning a Promise
    }
  }
  ```

3. If the hook doesn't return a Promise, but expects an argument (`transition`), then the hook will only be resolved when one of `transition.next()`, `transition.abort()` or `transition.redirect()` is called. For example:

  ``` js
  route: {
    activate: function (transition) {
      // resolve after 1 second
      setTimeout(transition.next, 1000)
    }
  }
  ```

4. In validation hooks such as `canActivate`, `canDeactivate` and the [global beforeEach hook](../api/before-each.md), returning a Boolean will synchronously resolve the hook, even if the hooks has the `transition` argument.

### Returning Promise in Hooks

- When you return a Promise in a transition hook, `transition.next` will be called for you when the Promise resolves successfully.

- If the Promise is rejected during validation phase, it will call `transition.abort`.

- If the Promise is rejected during activation phase, it will call `transition.next`.

- For validation hooks, if the Promise's resolved value is falsy, it will also abort the transition.

- If a rejected promise has an uncaught error, it will be thrown unless you suppress it with the `suppressTransitionError` option when creating the router.

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

We are asynchronously fetching data in the `activate` hook here just for the sake of an example; Note that we also have the [`data` hook](data.md) which is in general more appropriate for this purpose.

**TIP:** if you are using ES6 you can use argument destructuring to make your hooks cleaner:

``` js
route: {
  activate ({ next }) {
    // when done:
    next()
  }
}
```

For a full example of transition hooks in action, check out the [advanced example](https://github.com/vuejs/vue-router/tree/dev/example/advanced) in the vue-router repo.

### Hook Merging

Similar to component lifecycle hooks, the following route lifecycle hooks:

- `data`
- `activate`
- `deactivate`

...are "merged" during option merges (i.e. class extension or mixins). For example, if your component defines a route `data` hook, and uses a mixin that also provides a route `data` hook, both hooks will get called (mixin hooks called first) and the resolved data from all hooks will be merged together.

Note that validation hooks like `canActivate`, `canDeactivate` and `canReuse` are always overwritten by the newer value during option merges.
