
# 導航守衛

>（譯者：『導航』表示路由正在發生改變。）

正如其名，`vue-router` 提供的導航守衛主要用來通過跳轉或取消的方式守衛導航。有多種機會植入路由導航過程中：全局的, 單個路由獨享的, 或者組件級的。

記住**參數或查詢的改變並不會觸發進入/離開的導航守衛**。你可以通過[觀察 `$route` 對象](../essentials/dynamic-matching.md#響應路由參數的變化)來應對這些變化，或使用 `beforeRouteUpdate` 的組件內守衛。

### 全局守衛

你可以使用 `router.beforeEach` 註冊一個全局前置守衛：

``` js
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  // ...
})
```

當一個導航觸發時，全局前置守衛按照創建順序調用。守衛是非同步解析執行，此時導航在所有守衛 resolve 完之前一直處於 **等待中**。

每個守衛方法接收三個參數：

- **`to: Route`**: 即將要進入的目標 [路由對象](../api/route-object.md)

- **`from: Route`**: 當前導航正要離開的路由

- **`next: Function`**: 一定要調用該方法來 **resolve** 這個鈎子。執行效果依賴 `next` 方法的調用參數。

  - **`next()`**: 進行管道中的下一個鈎子。如果全部鈎子執行完了，則導航的狀態就是 **confirmed** （確認的）。

  - **`next(false)`**: 中斷當前的導航。如果瀏覽器的 URL 改變了（可能是用戶手動或者瀏覽器後退按鈕），那麼 URL 地址會重置到 `from` 路由對應的地址。

  - **`next('/')` 或者 `next({ path: '/' })`**: 跳轉到一個不同的地址。當前的導航被中斷，然後進行一個新的導航。

  - **`next(error)`**: (2.4.0+) 如果傳入 `next` 的參數是一個 `Error` 實例，則導航會被終止且該錯誤會被傳遞給 `router.onError()` 註冊過的回調。

**確保要調用 `next` 方法，否則鈎子就不會被 resolved。**

### 全局解析守衛

> 2.5.0 新增

在 2.5.0+ 你可以用 `router.beforeResolve` 註冊一個全局守衛。這和 `router.beforeEach` 類似，區別是在導航被確認之前，**同時在所有組件內守衛和非同步路由組件被解析之後**，解析守衛就被調用。

### 全局後置鈎子

你也可以註冊全局後置鈎子，然而和守衛不同的是，這些鈎子不會接受 `next` 函數也不會改變導航本身：

``` js
router.afterEach((to, from) => {
  // ...
})
```

### 路由獨享的守衛

你可以在路由配置上直接定義 `beforeEnter` 守衛：

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      }
    }
  ]
})
```

這些守衛與全局前置守衛的方法參數是一樣的。

### 組件內的守衛

最後，你可以在路由組件內直接定義以下路由導航守衛：

- `beforeRouteEnter`
- `beforeRouteUpdate` (2.2 新增)
- `beforeRouteLeave`

``` js
const Foo = {
  template: `...`,
  beforeRouteEnter (to, from, next) {
    // 在渲染該組件的對應路由被 confirm 前調用
    // 不！能！獲取組件實例 `this`
    // 因為當守衛執行前，組件實例還沒被創建
  },
  beforeRouteUpdate (to, from, next) {
    // 在當前路由改變，但是該組件被復用時調用
    // 舉例來說，對於一個帶有動態參數的路徑 /foo/:id，在 /foo/1 和 /foo/2 之間跳轉的時候，
    // 由於會渲染同樣的 Foo 組件，因此組件實例會被復用。而這個鈎子就會在這個情況下被調用。
    // 可以訪問組件實例 `this`
  },
  beforeRouteLeave (to, from, next) {
    // 導航離開該組件的對應路由時調用
    // 可以訪問組件實例 `this`
  }
}
```

`beforeRouteEnter` 守衛 **不能** 訪問 `this`，因為守衛在導航確認前被調用,因此即將登場的新組件還沒被創建。

不過，你可以通過傳一個回調給 `next`來訪問組件實例。在導航被確認的時候執行回調，並且把組件實例作為回調方法的參數。

``` js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // 通過 `vm` 訪問組件實例
  })
}
```

你可以 在 `beforeRouteLeave` 中直接訪問 `this`。這個離開守衛通常用來禁止用戶在還未保存修改前突然離開。可以通過 `next(false)` 來取消導航。

### 完整的導航解析流程

1. 導航被觸發。
2. 在失活的組件裡調用離開守衛。
3. 調用全局的 `beforeEach` 守衛。
4. 在重用的組件裡調用 `beforeRouteUpdate` 守衛 (2.2+)。
5. 在路由配置裡調用 `beforeEnter`。
6. 解析非同步路由組件。
7. 在被激活的組件裡調用 `beforeRouteEnter`。
8. 調用全局的 `beforeResolve` 守衛 (2.5+)。
9. 導航被確認。
10. 調用全局的 `afterEach` 鈎子。
11. 觸發 DOM 更新。
12. 用創建好的實例調用 `beforeRouteEnter` 守衛中傳給 `next` 的回調函數。

