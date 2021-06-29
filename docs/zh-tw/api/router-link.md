
# `<router-link>`

`<router-link>` 組件支持用戶在具有路由功能的應用中（點擊）導航。
通過 `to` 屬性指定目標地址，默認渲染成帶有正確連結的 `<a>` 標籤，可以通過配置 `tag` 屬性生成別的標籤.。另外，當目標路由成功激活時，連結元素自動設置一個表示激活的 CSS 類名。

`<router-link>` 比起寫死的 `<a href="...">` 會好一些，理由如下：

- 無論是 HTML5 history 模式還是 hash 模式，它的表現行為一致，所以，當你要切換路由模式，或者在 IE9 降級使用 hash 模式，無須作任何變動。

- 在 HTML5 history 模式下，`router-link`  會守衛點擊事件，讓瀏覽器不再重新加載頁面。

- 當你在 HTML5 history 模式下使用 `base` 選項之後，所有的 `to` 屬性都不需要寫（基路徑）了。

### Props

- **to**

  - 類型: `string | Location`

  - required

  表示目標路由的連結。當被點擊後，內部會立刻把 `to` 的值傳到 `router.push()`，所以這個值可以是一個字元串或者是描述目標位置的對象。

  ``` html
  <!-- 字元串 -->
  <router-link to="home">Home</router-link>
  <!-- 渲染結果 -->
  <a href="home">Home</a>

  <!-- 使用 v-bind 的 JS 表達式 -->
  <router-link v-bind:to="'home'">Home</router-link>

  <!-- 不寫 v-bind 也可以，就像綁定別的屬性一樣 -->
  <router-link :to="'home'">Home</router-link>

  <!-- 同上 -->
  <router-link :to="{ path: 'home' }">Home</router-link>

  <!-- 命名的路由 -->
  <router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>

  <!-- 帶查詢參數，下面的結果為 /register?plan=private -->
  <router-link :to="{ path: 'register', query: { plan: 'private' }}">Register</router-link>
  ```

- **replace**

  - 類型: `boolean`

  - 默認值: `false`

  設置 `replace` 屬性的話，當點擊時，會調用 `router.replace()` 而不是 `router.push()`，於是導航後不會留下 history 記錄。

  ``` html
  <router-link :to="{ path: '/abc'}" replace></router-link>
  ```

- **append**

  - 類型: `boolean`

  - 默認值: `false`

  設置 `append` 屬性後，則在當前（相對）路徑前添加基路徑。例如，我們從 `/a` 導航到一個相對路徑 `b`，如果沒有配置 `append`，則路徑為 `/b`，如果配了，則為 `/a/b`

  ``` html
  <router-link :to="{ path: 'relative/path'}" append></router-link>
  ```

- **tag**

  - 類型: `string`

  - 默認值: `"a"`

  有時候想要  `<router-link>` 渲染成某種標籤，例如 `<li>`。
  於是我們使用 `tag` prop 類指定何種標籤，同樣它還是會監聽點擊，觸發導航。

  ``` html
  <router-link to="/foo" tag="li">foo</router-link>
  <!-- 渲染結果 -->
  <li>foo</li>
  ```

- **active-class**

  - 類型: `string`

  - 默認值: `"router-link-active"`

  設置 連結激活時使用的 CSS 類名。默認值可以通過路由的構造選項 `linkActiveClass` 來全局配置。

- **exact**

  - 類型: `boolean`

  - 默認值: `false`

  "是否激活" 默認類名的依據是 **inclusive match** （全包含匹配）。
  舉個例子，如果當前的路徑是 `/a` 開頭的，那麼 `<router-link to="/a">` 也會被設置 CSS 類名。

  按照這個規則，`<router-link to="/">` 將會點亮各個路由！想要連結使用 "exact 匹配模式"，則使用 `exact` 屬性：

  ``` html
  <!-- 這個連結只會在地址為 / 的時候被激活 -->
  <router-link to="/" exact>
  ```

  查看更多關於激活連結類名的例子[可運行](https://jsfiddle.net/8xrk1n9f/)

- **event**

  > 2.1.0+

  - 類型: `string | Array<string>`

  - 默認值: `'click'`

  聲明可以用來觸發導航的事件。可以是一個字元串或是一個包含字元串的數組。

- **exact-active-class**

  > 2.5.0+

  - 類型: `string`

  - 默認值: `"router-link-exact-active"`

  配置當連結被精確匹配的時候應該激活的 class。注意默認值也是可以通過路由建構子選項 `linkExactActiveClass` 進行全局配置的。

###  將激活 class 應用在外層元素

有時候我們要讓激活 class 應用在外層元素，而不是 `<a>` 標籤本身，那麼可以用 `<router-link>` 渲染外層元素，包裹著內層的原生 `<a>` 標籤：

``` html
<router-link tag="li" to="/foo">
  <a>/foo</a>
</router-link>
```

在這種情況下，`<a>` 將作為真實的連結（它會獲得正確的 `href` 的），而 "激活時的CSS類名" 則設置到外層的 `<li>`。

