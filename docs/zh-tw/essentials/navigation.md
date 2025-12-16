
# 編程式的導航

除了使用 `<router-link>` 創建 a 標籤來定義導航連結，我們還可以借助 router 的實例方法，通過編寫代碼來實現。

#### `router.push(location, onComplete?, onAbort?)`

**注意：在 Vue 實例內部，你可以通過 `$router` 訪問路由實例。因此你可以調用 `this.$router.push`。**

想要導航到不同的 URL，則使用 `router.push` 方法。這個方法會向 history 棧添加一個新的記錄，所以，當用戶點擊瀏覽器後退按鈕時，則回到之前的 URL。

當你點擊 `<router-link>` 時，這個方法會在內部調用，所以說，點擊 `<router-link :to="...">` 等同於調用 `router.push(...)`。

| 聲明式 | 編程式 |
|-------------|--------------|
| `<router-link :to="...">` | `router.push(...)` |

該方法的參數可以是一個字元串路徑，或者一個描述地址的對象。例如：

``` js
// 字元串
router.push('home')

// 對象
router.push({ path: 'home' })

// 命名的路由
router.push({ name: 'user', params: { userId: 123 }})

// 帶查詢參數，變成 /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})
```

**注意：如果提供了 `path`，`params` 會被忽略，上述例子中的 `query` 並不屬於這種情況。取而代之的是下面例子的做法，你需要提供路由的 `name` 或手寫完整的帶有參數的 `path`：**

```js
const userId = 123
router.push({ name: 'user', params: { userId }}) // -> /user/123
router.push({ path: `/user/${userId}` }) // -> /user/123
// 這裡的 params 不生效
router.push({ path: '/user', params: { userId }}) // -> /user
```

同樣的規則也適用於 `router-link` 組件的 `to` 屬性。

在 2.2.0+，可選的在 `router.push` 或 `router.replace` 中提供 `onComplete` 和 `onAbort` 回調作為第二個和第三個參數。這些回調將會在導航成功完成 (在所有的非同步鈎子被解析之後) 或終止 (導航到相同的路由、或在當前導航完成之前導航到另一個不同的路由) 的時候進行相應的調用。

**注意：**如果目的地和當前路由相同，只有參數發生了改變 (比如從一個用戶資料到另一個 `/users/1` -> `/users/2`)，你需要使用 [`beforeRouteUpdate`](./dynamic-matching.html#響應路由參數的變化) 來響應這個變化 (比如抓取用戶信息)。

#### `router.replace(location, onComplete?, onAbort?)`

跟 `router.push` 很像，唯一的不同就是，它不會向 history 添加新記錄，而是跟它的方法名一樣 —— 替換掉當前的 history 記錄。

| 聲明式 | 編程式 |
|-------------|--------------|
| `<router-link :to="..." replace>` | `router.replace(...)` |

#### `router.go(n)`

這個方法的參數是一個整數，意思是在 history 記錄中向前或者後退多少步，類似 `window.history.go(n)`。

例子

``` js
// 在瀏覽器記錄中前進一步，等同於 history.forward()
router.go(1)

// 後退一步記錄，等同於 history.back()
router.go(-1)

// 前進 3 步記錄
router.go(3)

// 如果 history 記錄不夠用，那就默默地失敗唄
router.go(-100)
router.go(100)
```

#### 操作 History

你也許注意到 `router.push`、 `router.replace` 和 `router.go` 跟 [`window.history.pushState`、 `window.history.replaceState` 和 `window.history.go`](https://developer.mozilla.org/en-US/docs/Web/API/History)好像， 實際上它們確實是效仿 `window.history` API 的。

因此，如果你已經熟悉 [Browser History APIs](https://developer.mozilla.org/en-US/docs/Web/API/History_API)，那麼在 vue-router 中操作 history 就是超級簡單的。

還有值得提及的，vue-router 的導航方法 （`push`、 `replace`、 `go`） 在各類路由模式（`history`、 `hash` 和 `abstract`）下表現一致。

