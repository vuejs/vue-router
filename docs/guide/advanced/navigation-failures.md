# Navigation Failures

When using `router-link`, Vue Router internally calls `router.push` to trigger a navigation. Depending on the current location and existing [Navigation Guards](./navigation-guards.md), this navigation might end up in a new page being shown, but there are a couple of situations where we will stay on the same page:

- We are already on the page we are trying to go to
- A navigation guard aborts the navigation by calling `next(false)`
- A navigation guard throws an error or calls `next(new Error())`

When using a regular `router-link`, **none of these failures will log an error**. However, if you are using `router.push` or `router.replace`, you might come across an _"Uncaught (in promise) Error"_ message followed by a more specific message in your console. This is part of the _Navigation Failures_ system in Vue Router and it is only available from version 3.2.0 onwards but existed for a long time before: through the two optional callbacks, `onComplete` and `onAbort` that can be passed to `router.push`. Since version 3.1.0, `router.push` and `router.replace` return a _Promise_ if no `onComplete`/`onAbort` callback is provided. This _Promise_ resolves instead of invoking `onComplete` and rejects instead of invoking `onAbort`.

## Detecting Navigation Failures

_Navigation Failures_ are `Error` instances with a few extra properties. Among them, you can find a `type` property. This will allow you to check the type of the navigation failure:

```js
import { NavigationFailureType } from 'vue-router'

// trying to access an admin-only route
router.push('/admin').catch(failure => {
  if (failure) {
    if (failure.type === NavigationFailureType.redirected) {
      // show a small notification to the user
      showToast('Login in order to access the admin panel')
    }
  }
})
```

## `NavigationFailureType`

`NavigationFailureType` exposes the following properties to differentiate _Navigation Failures_:

- `redirected`: `next(newLocation)` was called inside of a navigation guard to redirect somewhere else.
- `aborted`: `next(false)` was called inside of a navigation guard to the navigation.
- `cancelled`: A new navigation completely took place before the current navigation could finish. e.g. `router.push` was called while waiting inside of a navigation guard.
- `duplicated`: The navigation was prevented because we are already at the target location.

## _Navigation Failures_'s properties

Apart from exposing a `type` property, all navigation failures expose `to` and `from` properties to reflect the current location as well as the target location for the navigation that failed:

```js
// given we are at `/`
router.push('/admin').catch(failure => {
  if (failure) {
    if (failure.type === NavigationFailureType.redirected) {
      failure.to.path // '/admin'
      failure.from.path // '/'
    }
  }
```

In all cases, `from` and `to` are normalized route locations.
