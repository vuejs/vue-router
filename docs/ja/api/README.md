---
sidebar: auto
---

# API リファレンス

## `<router-link>`

`<router-link>` はルーターが使用可能になっているアプリケーションでユーザーのナビゲーションを有効にするためのコンポーネントです。対象とする location は `to` プロパティを使って指定します。デフォルトでは正しい `href` と共に `<a>` タグとして描画しますが、 `tag` プロパティを設定することも可能です。さらに、対象のルートがアクティブの時に、そのリンクは自動的にアクティブな CSS クラスが当てられます。

下記の理由により `<router-link>` はハードコードする `<a href="...">` よりも好ましいです。

- HTML5 history モードでも hash モードでも同じ方法で動作します。もしあなたがモードを切り替えたりする場合や、IE9 で hash モードにフォールバックする場合に、何も変更する必要はありません。

- HTML5 history モードにおいて、ブラウザがページのリロードをしないように `router-link` はクリックイベントに割り込みます。

- HTML5 history モードで `base` オプションを使っている時に、 `to` プロパティの URL にそれを含める必要がありません。

### `v-slot` API (3.1.0 以降)

`router-link` は[スコープ付きスロット](https://jp.vuejs.org/v2/guide/components-slots.html#%E3%82%B9%E3%82%B3%E3%83%BC%E3%83%97%E4%BB%98%E3%81%8D%E3%82%B9%E3%83%AD%E3%83%83%E3%83%88)を通して低レベルなカスタマイズを提供しています。これは、主にライブラリ作者をターゲットにした高度な API ですが、ほとんどの場合 _NavLink_ などのようなカスタムコンポーネントでも同様に開発者にとっても大変便利です。

**`v-slot` API を使うとき、それは単一の子を `router-link` に通す必要がります。** そうしない場合は、 `router-linke` は `span` 要素で子をラップします。

```html
<router-link
  to="/about"
  v-slot="{ href, route, navigate, isActive, isExactActive }"
>
  <NavLink :active="isActive" :href="href" @click="navigate"
    >{{ route.fullPath }}</NavLink
  >
</router-link>
```

- `href`: 解決された url。これは、`a` 要素の `href` 属性になります
- `route`: 解決された正規化済みロケーション
- `navigate`: ナビゲーションをトリガーするための関数。`router-link` と同じように、**必要なときに自動的にイベントが起こらないようにします。**
- `isActive`: [アクティブクラス (active class)](#active-class) が適用されるとき、`true` になります。任意のクラスを適用できます。
- `isExactActive`: `true` if the [正確なアクティブクラス (exact active class)](#exact-active-class) が適用されるとき、`true` になります。 任意のクラスを適用できます。

#### 例: アクティブクラスを外部要素へ適用

アクティブクラスを `<a>` タグ自身よりも、外側の要素に対して適用したいことがあるでしょう。その場合、`<router-link>` 内の要素を `v-slot` を使ってリンクを作成することでラップできます。

```html
<router-link
  to="/foo"
  v-slot="{ href, route, navigate, isActive, isExactActive }"
>
  <li
    :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active']"
  >
    <a :href="href" @click="navigate">{{ route.fullPath }}</a>
  </li>
</router-link>
```

:::tip
`target="_blank"` を `a` 要素に追加する場合、`@click="navigate"` ハンドラを省略しなければなりません。
:::

## `<router-link>` Props

### to

  - 型: `string | Location`
  - 必須

　リンクする対象のルートを表します。クリックされた時に `to` プロパティの値が内部的に `router.push()` に渡されます。つまり、この値は文字列でも location を記述するオブジェクトでも構いません。

  ``` html
  <!-- 文字列 -->
  <router-link to="home">Home</router-link>
  <!-- 次のように描画される -->
  <a href="home">Home</a>

  <!-- `v-bind` を使った javascript 式-->
  <router-link v-bind:to="'home'">Home</router-link>

  <!-- 他のプロパティのバインディングのような `v-bind` の省略表現 -->
  <router-link :to="'home'">Home</router-link>

  <!-- 上記と同じ -->
  <router-link :to="{ path: 'home' }">Home</router-link>

  <!-- 名前付きルート -->
  <router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>

  <!-- 結果的に `/register?plan=private` になるクエリ-->
  <router-link :to="{ path: 'register', query: { plan: 'private' }}">Register</router-link>
  ```

### replace

  - 型: `boolean`
  - デフォルト: `false`

  `replace` プロパティを設定するとクリックされた時に `router.push()` の代わりに `router.replace()` が呼ばれます。したがって、ナビゲーションは history レコードに残りません。

  ``` html
  <router-link :to="{ path: '/abc'}" replace></router-link>
  ```

### append

  - 型: `boolean`
  - デフォルト: `false`

  `append` プロパティを設定すると現在のパスに対して常に相対パスを追加します。例えば、 `/a` から相対リンクの `b` へ遷移するのを想定した時に、 `append` がない場合は `/b` に、`append` がある場合は `/a/b` になります。

  ``` html
  <router-link :to="{ path: 'relative/path'}" append></router-link>
  ```

### tag

  - 型: `string`
  - デフォルト: `"a"`

  しばしば `<router-link>` を `<li>` などの他のタグとして描画したい時があるでしょう。そこで、どのタグとして描画するかを指定するために `tag` プロパティを使うことができます。そして、依然ナビゲーションのためのクリックイベントを listen します。

  ``` html
  <router-link to="/foo" tag="li">foo</router-link>
  <!-- 以下のように描画されます -->
  <li>foo</li>
  ```

### active-class

  - 型: `string`
  - デフォルト: `"router-link-active"`

  リンクがアクティブな時に適用されるアクティブ CSS クラスの設定です。デフォルト値はルーターコンストラクタオプションの `linkActiveClass` でグローバルに設定可能です。

### exact

  - 型: `boolean`
  - デフォルト: `false`

  デフォルトのアクティブクラスのマッチングの振る舞いは **包含的なマッチ** です。 例えば、現在のパスが `/a/` または `/a` から始まる限りは、`<router-link to="/a">` にアクティブクラスが適用されます。

  この結果として `<router-link to="/">` は全てのルートに対してアクティブになります! リンクに対して "正確なマッチモード" を強制するために、 `exact` プロパティを使ってください。

  ``` html
  <!-- このリンクは `/` だけにアクティブになります -->
  <router-link to="/" exact></router-link>
  ```

  アクティブリンククラスをより説明している例としてこちらの [動作](https://jsfiddle.net/8xrk1n9f/) を確認してください。

### event

  - 型: `string | Array<string>`
  - デフォルト: `'click'`

  リンクナビゲーションをトリガーできるイベントを指定します。

### exact-active-class

  - 型 `string`
  - デフォルト: `"router-link-exact-active"`

  完全一致によってリンクがアクティブになっているときに適用されるアクティブな CSS クラスを設定します。デフォルト値は `linkExactActiveClass` ルーターコンストラクタのオプション経由でグローバルに設定することもできます。

### aria-current-value

- 型: `'page' | 'step' | 'location' | 'date' | 'time'`
- デフォルト: `"page"`

  完全一致によってリンクがアクティブになっているときに `aria-current` の値を設定します。ARIA spec において[aria-current で許可されている値](https://www.w3.org/TR/wai-aria-1.2/#aria-current)の1つでなければなりません。ほとんどの場合、デフォルト`page` が最適です。

## `<router-view>`

`<router-view>` コンポーネントは与えられたパスに対してマッチしたコンポーネントを描画する関数型コンポーネントです。`<router-view>` の中で描画されるコンポーネント自身もまた、ネストされたパスに対してコンポーネントを描画するための `<router-view>` を持つことができます。

name ではないプロパティも描画されるコンポーネントに渡されますが、ほとんどの場合ルート単位のデータはルートのパラメーターに含まれています。

これは普通のコンポーネントなので、 `<transition>` と `<keep-alive>` と共に動作します。両方を同時に使用する場合は `<keep-alive>` を内側にするようにしてください。

``` html
<transition>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</transition>
```

## `<router-view>` Props

### name

  - 型: `string`
  - デフォルト: `"default"`

  `<router-view>` が名前を持つ時、マッチしたルートレコードの `components` オプション内で対応する名前のコンポーネントを描画します。例は [名前付きビュー](../guide/essentials/named-views.md) をご参照ください。

## ルーターコンストラクタオプション

### routes

- 型: `Array<RouteConfig>`

  `RouteConfig` の型宣言:

  ``` ts
  interface RouteConfig = {
    path: string;
    component?: Component;
    name?: string; // 名前付きルート用
    components?: { [name: string]: Component }; // 名前付き view 用
    redirect?: string | Location | Function;
    props?: boolean | Object | Function;
    alias?: string | Array<string>;
    children?: Array<RouteConfig>; // ネストされたルート用
    beforeEnter?: (to: Route, from: Route, next: Function) => void;
    meta?: any;

    // 2.6.0+
    caseSensitive?: boolean; // センシティブマッチをケースとして使用するかどうか? (デフォルト: false)
    pathToRegexpOptions?: Object; // 正規表現のコンパイルとして path-to-regexp オプション
  }
  ```

### mode

- 型: `string`

- デフォルト: `"hash" (in browser) | "abstract" (in Node.js)`

- 利用可能な値: `"hash" | "history" | "abstract"`

  ルーターモードの設定。

  - `hash`: ルーティングに URL hash を使います。HTML5 History API をサポートしていないブラウザ含めて、全ての Vue がサポートしているブラウザで動作します。

  - `history`: HTML5 History API とサーバーの設定が必要です。[HTML5 History モード](../guide/essentials/history-mode.md) を参照してください。

  - `abstract`: 全ての JavaScript の環境で動作します。 e.g. Node.js を使ったサーバーサイド。 **もしブラウザの API が存在しない場合、ルーターは自動的にこのモードに強制されます。**

### base

- 型: `string`

- デフォルト: `"/"`

  アプリケーションのベース URL です。例えば、 `/app/` 配下で完全なシングルページアプリケーションを提供する場合、 `base` は `"/app/"` の値が使われるべきです。

### linkActiveClass

- 型: `string`

- デフォルト: `"router-link-active"`

  グローバルに設定される `<router-link>` のデフォルトのアクティブクラスです。こちらの [router-link](#router-link) も参照してください。

### linkExactActiveClass

- 型: `string`

- デフォルト: `"router-link-exact-active"`

  完全一致に対してグローバルな `<router-link>` デフォルトアクティブクラスを設定します。[router-link](#router-link) も参照してください。

### scrollBehavior

- 型: `Function`

  シグネチャ:

  ```ts
  type PositionDescriptor =
    { x: number, y: number } |
    { selector: string } |
    void

  type scrollBehaviorHandler = (
    to: Route,
    from: Route,
    savedPosition?: { x: number, y: number }
  ) => PositionDescriptor | Promise<PositionDescriptor>
  ```

  より詳細については [スクロールの振る舞い](../guide/advanced/scroll-behavior.md) を参照してください。

### parseQuery / stringifyQuery

- 型: `Function`

  カスタムクエリ構文解析関数 / 文字列化関数を提供します。デフォルトを上書きします。

### fallback

- 型: `boolean`
- デフォルト: `true`

  `history.pushState` がサポートされていないブラウザにおいて、モードが `history` に設定されているとき、ルーターを `hash` モードにフォールバックかどうか制御します。

  これを `false` に設定すると、本質的に全ての `router-link` ナビゲーションが IE9 においてフルページリフレッシュになります。これは、サーバサイドレンダリングでハッシュモードの URL が機能しないため、IE9 で動作する必要がある場合に便利です。

## ルーターインスタンスプロパティ

### router.app

- 型: `Vue インスタンス`

  `router` が注入される root の Vue インスタンス

### router.mode

- 型: `string`

  ルーターが使う [モード](#mode) 。

### router.currentRoute

- 型: `Route`

  [ルーターオブジェクト](#ルートオブジェクト) として表される現在のルート。

## メソッド

### router.beforeEach
### router.beforeResolve
### router.afterEach

シグネチャ:

``` js
router.beforeEach((to, from, next) => {
  /* `next` を呼び出さなければならない */
})

router.beforeResolve((to, from, next) => {
  /* `next` を呼び出さなければならない */
})

router.afterEach((to, from) => {})
```

  グローバルなナビゲーションガードの追加。[ナビゲーションガード](../guide/advanced/navigation-guards.md) をご参照ください。

  2.5.0 以降では、3 つのメソッドすべてが、登録されたガード/フックを削除する関数を返します。

### router.push
### router.replace
### router.go
### router.back
### router.forward

シグネチャ:

``` js
router.push(location, onComplete?, onAbort?)
router.push(location).then(onComplete).catch(onAbort)
router.replace(location, onComplete?, onAbort?)
router.replace(location).then(onComplete).catch(onAbort)
router.go(n)
router.back()
router.forward()
```

  プログラムによる新しい URL へのナビゲーション。 [プログラムによるナビゲーション](../guide/essentials/navigation.md) をご参照ください。

### router.getMatchedComponents

シグネチャ:

``` js
const matchedComponents: Array<Component> = router.getMatchedComponents(location?)
```

  現在のルートまたは提供されたロケーションにマッチしているコンポーネント (インスタンスではなく定義 / コンストラクタ) の配列を返します。これは大抵の場合データ取得を行うサーバーサイドレンダリングで使用されます。

### router.resolve

シグネチャ:

``` js
const resolved: {
  location: Location;
  route: Route;
  href: string;
} = router.resolve(location, current?, append?)
```

  逆 URL 解決します。`<router-link/>` で使われているものと同じ形式の location が与えられた場合は、以下の解決されたプロパティを返します。

 - `current` はデフォルトによる現在のルートです(ほとんどの場合、これを変更する必要はありません)
 - `append` は `current` ルートにパスを追加できます([`router-link`](#router-link-props)と同様に)

### router.addRoutes

シグネチャ:

``` js
router.addRoutes(routes: Array<RouteConfig>)
```

  動的にルートをルーターに追加します。引数は `routes` コンストラクタオプションで同じルート設定形式を使用する配列でなければなりません。

### router.onReady

シグネチャ:

``` js
router.onReady(callback, [errorCallback])
```

  このメソッドは、ルーターが初期ナビゲーションを完了したときに呼び出されるコールバックをキューに入れます。つまり、初期ルートに関連付けられているすべての非同期 enter フックと非同期コンポーネントを解決したことを意味します。

  これは、サーバーとクライアントの両方で一貫した出力を保証するために、サーバーサイドレンダリングに役立ちます。

  第 2 引数 `errorCallback` は 2.4 以降でのみサポートされます。初期ルート解決がエラーの時に、呼び出されます (例: 非同期コンポーネントの解決が失敗)。

### router.onError

シグネチャ:

``` js
router.onError(callback)
```

  ルートナビゲーション中にエラーが検出されたときに呼び出されるコールバックを登録します。エラーを呼び出すには、次のいずれかのシナリオが必要であることに注意してください:

  - エラーがルートガード関数内で同期的に投げられる;

  - エラーが補足され、ルートガード関数内で `next(err)` を呼び出すことによって非同期に処理される;

  - ルートを描画するために必須な非同期コンポーネントを解決しようとする時に発生したエラー;

## ルートオブジェクト

**ルートオブジェクト**は現在のアクティブなルートの状態を表現しています。現在の URL をパースした情報と、その URL とマッチした**ルートレコード**を保持しています。

ルートオブジェクトは変更不可です。成功した全てのナビゲーションは結果的に新たなルートオブジェクトになります。

ルートオブジェクトは複数の場所に存在します。

- コンポーネント内での `this.$route`

- `$route` watcher コールバック内部

- `router.match(location)` を呼び出した時の返り値

- ナビゲーションガード内での第 1 引数、第 2 引数として:

  ``` js
  router.beforeEach((to, from, next) => {
    // `to` と `from` は両方ともルートオブジェクト
  })
  ```

- `scrollBehavior` 関数内の第 1 引数、第 2 引数として:

  ``` js
  const router = new VueRouter({
    scrollBehavior (to, from, savedPosition) {
      // `to` と `from` は両方ともルートオブジェクト
    }
  })
  ```

### ルートオブジェクトプロパティ

- **$route.path**

  - 型: `string`

    現在のルートのパスに等しい文字列。常に絶対パスとして解釈されます。e.g. `"/foo/bar"`

- **$route.params**

  - 型: `Object`

    動的セグメントとスターセグメントの key/value ペアを保持するオブジェクト。もしパラメーターがない場合、この値は空オブジェクトになります。

- **$route.query**

  - 型: `Object`

    クエリ文字列の key/value ペアを保持するオブジェクト。例えば `/foo?user=1` というパスの場合、`$route.query.user == 1` となります。もしクエリがない場合は、この値は空オブジェクトになります。

- **$route.hash**

  - 型: `string`

    hash がある時の現在のルートの hash (# 有り) です。もし hash がない場合、この値は空オブジェクトになります。

- **$route.fullPath**

  - 型: `string`

    クエリや hash を含む完全に解決された URL です。

- **$route.matched**

  - 型: `Array<RouteRecord>`

  現在のルートのネストされた全パスセグメントに対しての **ルートレコード** を保持している配列です。ルートレコードは `routes` 設定の配列 (と `children` 配列) 内のオブジェクトのコピーです。

  ``` js
  const router = new VueRouter({
    routes: [
      // 以下のオブジェクトがルートレコード
      { path: '/foo',
        component: Foo,
        children: [
          // こちらもルートレコード
          { path: 'bar', component: Bar }
        ]
      }
    ]
  })
  ```

  URL が `/foo/bar` である時、 `$route.matched` は親から子の順番で両方の (クローンされた) オブジェクトを含む配列になります。

- **$route.name**

  名前がある場合の現在のルートの名前です。(詳しくは [名前付きルート](../guide/essentials/named-routes.md) をご参照ください)

- **$route.redirectedFrom**

  もしあれば、リダイレクト元の名前。(参照[リダイレクトとエイリアス](../guide/essentials/redirect-and-alias.md))

## コンポーネント注入

### 注入されるプロパティ

ルーターインスタンスを root インスタンスに `router` オプションとして渡すことによって、全ての子コンポーネントに以下のプロパティが注入されます。

- **this.$router**

  ルーターインスタンス

- **this.$route**

  現在のアクティブな [ルート](#ルートオブジェクト) 。このプロパティは読み出しのみ可能かつ変更不可ですが、watch は可能です。

### 有効になるオプション

- **beforeRouteEnter**
- **beforeRouteUpdate**
- **beforeRouteLeave**

  [コンポーネント内ガード](../guide/advanced/navigation-guards.md#コンポーネント内ガード) をご参照ください。
