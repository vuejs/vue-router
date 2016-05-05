# `data(transition) [-> Promise]`

Called on an incoming component during the activation phase, after the `activate` hook has been resolved. **It is also called when the route has changed and the current component is reused**. Use this hook to load and set data on the current component.

### Arguments

- [`transition {Transition}`](hooks.md#transition-object)

  Calling `transition.next(data)` will set each property in `data` on the component. For example, with `{ a: 1, b: 2 }`, the router will call `component.$set('a', 1)` and `component.$set('b', 2)`.

### Expected Return Value

- optionally return a Promise.
  - `resolve(data)` -> `transition.next(data)`
  - `reject(reason)` -> `transition.abort(reason)`


- **OR:** return an Object containing Promises. See [Promise sugar](#promise-sugar) below.

### Details

The `data` transition hook is called immediately after the `activate` hook is resolved, and right before the view switching is executed. The entering component gets a **`$loadingRouteData`** meta property, which starts with value `true` and set to `false` when the `data` hook is resolved. This property can be used to display a loading state for the entering component.

When resolved, the component will also emit a `'route-data-loaded'` event.

The `data` hook is different from `activate` in that:

1. `data` is also called every time the route changes, even if the current component is reused, while `activate` is only called when component is newly created.

  Imagine we have a component for the route `/message/:id`, and we are currently on `/message/1`. When the user navigates to `/message/2`, the current component can be reused, so the `activate` hook will not get called. But we do want to fetch and update the data based on the new `id` param, so in most cases it makes sense to do data fetching in `data` instead of `activate`.

2. `activate`'s responsibility is controlling the timing of switching to the new component. In comparison, `data` is called right after `activate` is resolved and right before the view switching happens, so the data fetching and the new component's entering animation will go in parallel, and the component will be in a "loading" state before `data` is resolved.

  Let's consider the difference in the User Experience here:

  - If we wait for the data to be fetched before displaying the new component, the user will feel like the interface is "stuck" for a split second before the view switches.

  - Instead, we can react to user input instantly and start switching the view, while displaying the new component with a "loading" state. If we have a CSS transition in between, the animation time can overlap nicely with the data wait time.

With that said, if you still wish to wait until data is loaded before switching the view, you can add **`waitForData: true`** inside your component's `route` option.

### Examples

By calling `transition.next`:

``` js
route: {
  data: function (transition) {
    setTimeout(function () {
      transition.next({
        message: 'data fetched!'
      })
    }, 1000)
  }
}
```

By returning a Promise:

``` js
route: {
  data: function (transition) {
    return messageService
      .fetch(transition.to.params.messageId)
      .then(function (message) {
        return { message: message }
      })
  }
}
```

Parallel requests, with Promise & ES6:

``` js
route: {
  data ({ to: { params: { userId }}}) {
    return Promise.all([
      userService.get(userId),
      postsService.getForUser(userId)
    ]).then(([user, post]) => ({ user, post }))
  }
}
```

Equivalent of above in ES5:

``` js
route: {
  data (transition) {
    var userId = transition.to.params.userId
    return Promise.all([
      userService.get(userId),
      postsService.getForUser(userId)
    ]).then(function (data) {
      return {
        user: data[0],
        posts: data[1]
      }
    })
  }
}
```

Using `$loadingRouteData` in templates:

``` html
<div class="view">
  <div v-if="$loadingRouteData">Loading ...</div>
  <div v-if="!$loadingRouteData">
    <user-profile user="{{user}}"></user-profile>
    <user-post v-for="post in posts" :post="post"></user-post>
  </div>
</div>
```

### Promise Sugar

The parallel data fetching example above requires us to leverage `Promise.all` to combine multiple Promises into a single one, and the desturcturing and formatting is still a bit cumbersome. `vue-router` provides a syntax sugar which allows you to return an Object containing Promises (it can contain non-Promise fields too, of course). Here's the same example using the syntax sugar and ES6:

``` js
route: {
  data: ({ to: { params: { userId }}}) => ({
    user: userService.get(userId),
    post: postsService.getForUser(userId)
  })
}
```

The router will set the component's `user` and `post` fields to the corresponding Promises' resolved values when they are resolved. `$loadingRouteData` will be set to `false` when all Promises have been resolved.

Equivalent in ES5:

``` js
route: {
  data: function (transition) {
    var userId = transition.to.params.userId
    return {
      user: userService.get(userId),
      post: postsService.getForUser(userId)
    }
  }
}
```
