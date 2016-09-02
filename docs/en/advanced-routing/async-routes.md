# Async Routes

Sometimes you need to fetch data from the server before rendering a route. For
example, before visiting a user profile, you have to fetch his data from the
server. From version 2 we can achieve this in two different ways. Each way
provide a different UX approach and both of them are valid designs.


## Fetching before navigation

This method consists on fetching the data before actually navigating to the new
route. For those using vue-router 1, this is works as the `activate` hook. In
vue-router 2 you use the `beforeEnter` hook to control the navigation flow. You
get access to the `route`, a `redirect` function and a `next` callback to let
the navigation end. Not calling the `next` callback will simply cancel the
navigation.

``` js
const router = new VueRouter({
  routes: [
    ...
    {
      path: '/post/:id',
      component: Post,
      beforeEnter: function (route, redirect, next) {
        // Fetch the post with the id provided on the route
        postsResource.fetch(route.params.id)
        .then(next)
      }
    }
  ]
})
```

The user still can use the application while the resource is being fetched.
Therefore you should show him with a progress bar or any other indicator that
the web site is waiting for data. If the user navigates somewhere else by
clicking on a link, any navigation going on which is still not resolved, will be
canceled.

## Fetching inside the view

This method consists on fetching data during the component lifecycle. It allows
you to define how the content of your view is presented while the resources are
loading.


This way you can control how loading is handled in each view.


TODO talk about fetching in created hook

TODO talk about using the beforeEnter option in route definition

Going somewhere else in the before next is called will cancel it (explain with example)


# `activate(transition) [-> Promise]`

Called on an incoming component during the activation phase when it is created and about to get transitioned in.

### Arguments

- [`transition {Transition}`](hooks.md#transition-object)

  Call `transition.next()` to resolve the hook. Note calling `transition.abort()` here will not take the app back to the previous route because the transition has already been validated.

### Expected Return Value

- Optionally return a Promise.
  - `resolve` -> `transition.next()`
  - `reject(reason)` -> `transition.abort(reason)`

### Details

In most cases this hook is used to control the timing of the view switching, because the view switching will not happen until this hook is resolved.

This hook is called top-down. A child view's `activate` will only get called when its parent view's `activate` has been resolved.
