# Navigation Failures

> New in 3.4.0

When using `router-link`, Vue Router calls `router.push` to trigger a navigation. While the expected behavior for most links is to navigate a user to a new page, there are a few situations where users will remain on the same page:

- Users are already on the page that they are trying to navigate to
- A [navigation guard](./navigation-guards.md) aborts the navigation by calling `next(false)`
- A [navigation guard](./navigation-guards.md) throws an error or calls `next(new Error())`

When using a `router-link` component, **none of these failures will log an error**. However, if you are using `router.push` or `router.replace`, you might come across an _"Uncaught (in promise) Error"_ message followed by a more specific message in your console. Let's understand how to differentiate _Navigation Failures_.

::: tip Background story
In v3.2.0, _Navigation Failures_ were exposed through the two optional callbacks of `router.push`: `onComplete` and `onAbort`. Since version 3.1.0, `router.push` and `router.replace` return a _Promise_ if no `onComplete`/`onAbort` callback is provided. This _Promise_ resolves instead of invoking `onComplete` and rejects instead of invoking `onAbort`.
:::

## Detecting Navigation Failures

_Navigation Failures_ are `Error` instances with a few extra properties. To check if an error comes from the Router, use the `isNavigationFailure` function:

```js
import VueRouter from 'vue-router'
const { isNavigationFailure, NavigationFailureType } = VueRouter

// trying to access the admin page
router.push('/admin').catch(failure => {
  if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
    // show a small notification to the user
    showToast('Login in order to access the admin panel')
  }
})
```

::: tip
If you omit the second parameter: `isNavigationFailure(failure)`, it will only check if the error is a _Navigation Failure_.
:::

## `NavigationFailureType`

`NavigationFailureType` help developers to differentiate between the various types of _Navigation Failures_. There are four different types:

- `redirected`: `next(newLocation)` was called inside of a navigation guard to redirect somewhere else.
- `aborted`: `next(false)` was called inside of a navigation guard to the navigation.
- `cancelled`: A new navigation completely took place before the current navigation could finish. e.g. `router.push` was called while waiting inside of a navigation guard.
- `duplicated`: The navigation was prevented because we are already at the target location.

## _Navigation Failures_'s properties

All navigation failures expose `to` and `from` properties to reflect the current location as well as the target location for the navigation that failed:

```js
// trying to access the admin page
router.push('/admin').catch(failure => {
  if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
    failure.to.path // '/admin'
    failure.from.path // '/'
  }
})
```

In all cases, `to` and `from` are normalized route locations.
