# `<router-link>`

`<router-link>` はルーターが使用可能になっているアプリケーションでユーザーのナビゲーションを有効にするためのコンポーネントです。対象とする location は `to` プロパティを使って指定します。デフォルトでは正しい `href` と共に `<a>` タグとして描画しますが、 `tag` プロパティを設定することも可能です。さらに、対象のルートがアクティブの時に、そのリンクは自動的にアクティブな CSS クラスが当てられます。

下記の理由により `<router-link>` はハードコードする `<a href="...">` よりも好ましいです。

- HTML5 history モードでも hash モードでも同じ方法で動作します。もしあなたがモードを切り替えたりする場合や、IE9 で hash モードにフォールバックする場合に、何も変更する必要はありません。

- HTML5 history モードにおいて、ブラウザがページのリロードをしないように `router-link` はクリックイベントに割り込みます。

- HTML5 history モードで `base` オプションを使っている時に、 `to` プロパティの URL にそれを含める必要がありません。

### プロパティ

- **to**

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

- **replace**

  - 型: `boolean`

  - デフォルト: `false`

  `replace` プロパティを設定するとクリックされた時に `router.push()` の代わりに `router.replace()` が呼ばれます。したがって、ナビゲーションは history レコードに残りません。

  ``` html
  <router-link :to="{ path: '/abc'}" replace></router-link>
  ```

- **append**

  - 型: `boolean`

  - デフォルト: `false`

  `append` プロパティを設定すると現在のパスに対して常に相対パスを追加します。例えば、 `/a` から相対リンクの `b` へ遷移するのを想定した時に、 `append` がない場合は `/b` に、`append` がある場合は `/a/b` になります。

  ``` html
  <router-link :to="{ path: 'relative/path'}" append></router-link>
  ```

- **tag**

  - 型: `string`

  - デフォルト: `"a"`

  しばしば `<router-link>` を `<li>` などの他のタグとして描画したい時があるでしょう。そこで、どのタグとして描画するかを指定するために `tag` プロパティを使うことができます。そして、依然ナビゲーションのためのクリックイベントを listen します。

  ``` html
  <router-link to="/foo" tag="li">foo</router-link>
  <!-- 以下のように描画されます -->
  <li>foo</li>
  ```

- **active-class**

  - 型: `string`

  - デフォルト: `"router-link-active"`

  リンクがアクティブな時に適用されるアクティブ CSS クラスの設定です。デフォルト値はルーターコンストラクタオプションの `linkActiveClass` でグローバルに設定可能です。

- **exact**

  - 型: `boolean`

  - デフォルト: `false`

  デフォルトのアクティブクラスのマッチングの振る舞いは **包含的なマッチ** です。 例えば、現在のパスが `/a/` または `/a` から始まる限りは、`<router-link to="/a">` にアクティブクラスが適用されます。

  この結果として `<router-link to="/">` は全てのルートに対してアクティブになります! リンクに対して "正確なマッチモード" を強制するために、 `exact` プロパティを使ってください。

  ``` html
  <!-- このリンクは `/` だけにアクティブになります -->
  <router-link to="/" exact>
  ```

  アクティブリンククラスをより説明している例としてこちらの [動作](https://jsfiddle.net/8xrk1n9f/) を確認してください。

- **event**

  > 2.1.0+

  - 型: `string | Array<string>`

  - デフォルト: `'click'`

  リンクナビゲーションをトリガーできるイベントを指定します。

- **exact-active-class**

  > 2.5.0+

  - 型 `string`

  - デフォルト: `"router-link-exact-active"`

  完全一致によってリンクがアクティブになっているときに適用されるアクティブな CSS クラスを設定します。デフォルト値は `linkExactActiveClass` ルーターコンストラクタのオプション経由でグローバルに設定することもできます。

### 外側の要素へのアクティブクラスの適用

アクティブクラスを `<a>` タグ自身よりも、外側の要素に対して適用したいことがあるでしょう。その場合、 `<router-link>` を使って外側の要素を描画して、その内側に生の `<a>` タグをラップすることができます。

``` html
<router-link tag="li" to="/foo">
  <a>/foo</a>
</router-link>
```

この時、 `<a>` は実際のリンクになります (そして正しい `href` が得られます)。しかし、アクティブクラスは外側の `<li>` に適用されます。
