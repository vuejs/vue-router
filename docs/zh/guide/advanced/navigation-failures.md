# 导航故障

> 3.4.0中新增

::: tip 译者注
*导航故障*，或者叫*导航失败*，表示一次失败的导航，原文叫 navigation failures，本文统一采用*导航故障*。
:::

当使用 `router-link` 组件时，Vue Router 会自动调用 `router.push` 来触发一次导航。 虽然大多数链接的预期行为是将用户导航到一个新页面，但也有少数情况下用户将留在同一页面上：

- 用户已经位于他们正在尝试导航到的页面
- 一个[导航守卫](./navigation-guards.md)通过调用 `next(false)` 中断了这次导航
- 一个[导航守卫](./navigation-guards.md)抛出了一个错误，或者调用了 `next(new Error())`

当使用 `router-link` 组件时，**这些失败都不会打印出错误**。然而，如果你使用 `router.push` 或者 `router.replace` 的话，可能会在控制台看到一条 _"Uncaught (in promise) Error"_ 这样的错误，后面跟着一条更具体的消息。让我们来了解一下如何区分*导航故障*。

::: tip 背景故事
在 v3.2.0 中，可以通过使用 `router.push` 的两个可选的回调函数：`onComplete` 和 `onAbort` 来暴露*导航故障*。从版本 3.1.0 开始，`router.push` 和 `router.replace` 在没有提供 `onComplete`/`onAbort` 回调的情况下会返回一个 *Promise*。这个 *Promise* 的 resolve 和 reject 将分别用来代替 `onComplete` 和 `onAbort` 的调用。
:::


## 检测导航故障

*导航故障*是一个 `Error` 实例，附带了一些额外的属性。要检查一个错误是否来自于路由器，可以使用 `isNavigationFailure` 函数：

```js
import VueRouter from 'vue-router'
const { isNavigationFailure, NavigationFailureType } = VueRouter

// 正在尝试访问 admin 页面
router.push('/admin').catch(failure => {
  if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
    // 向用户显示一个小通知
    showToast('Login in order to access the admin panel')
  }
})
```

::: tip
如果你忽略第二个参数：`isNavigationFailure(failure)`，那么就只会检查这个错误是不是一个*导航故障*。
:::

## `NavigationFailureType`

`NavigationFailureType` 可以帮助开发者来区分不同类型的*导航故障*。有四种不同的类型：

- `redirected`：在导航守卫中调用了 `next(newLocation)` 重定向到了其他地方。
- `aborted`：在导航守卫中调用了 `next(false)` 中断了本次导航。
- `cancelled`：在当前导航还没有完成之前又有了一个新的导航。比如，在等待导航守卫的过程中又调用了 `router.push`。
- `duplicated`：导航被阻止，因为我们已经在目标位置了。

## *导航故障*的属性

所有的导航故障都会有 `to` 和 `from` 属性，用来表达这次失败的导航的当前位置和目标位置。

```js
// 正在尝试访问 admin 页面
router.push('/admin').catch(failure => {
  if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
    failure.to.path // '/admin'
    failure.from.path // '/'
  }
})
```

在所有情况下，`to` 和 `from` 都是规范化的路由位置。
