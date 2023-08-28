# v-link

以下の理由のため、vue-router が使用可能になったアプリケーション内部でナビゲーションをハンドリングするために `v-link` ディレクティブを使用する必要があります:

`v-link` は ルーターが使用可能なアプリケーションでユーザーナビゲーションを有効にするためのディレクティブです。内部で `router.to()` に渡される JavaScript 式を受け付けます。例えば:

``` html
<!-- リテラル文字列 -->
<a v-link="'home'">Home</a>

<!-- 上記と同じ -->
<a v-link="{ path: 'home' }">Home</a>

<!-- named route -->
<a v-link="{ name: 'user', params: { userId: 123 }}">User</a>
```

`v-link` は以下の理由でハードコードされた `href` より良いです:

- HTML5 history モード と hash モード両方で同じように動作するため、もしいつかモードを切り替えることに決めた場合、また、ルーターが IE9 では hash モードにフォールバックするとき、何も変更する必要はありません。

- HTML5 history モードでは、`v-link` はブラウザがページのリロードするのを試行しないようにするために、クリックイベントに割り込みます。

- HTML5 history モードで `root` オプションを使用しているとき、`v-link` の URL にそれを含める必要はありません。

#### アクティブリンククラス

`v-link` を利用する要素で、現在のパスが `v-link` の URL にマッチするとき、自動的に対応するクラス名を取得します。適用されるデフォルトクラスは、`.v-link-active` で、デフォルトのマッチングの振舞いは、**包括一致 (inclusive match)** です。例えば、`v-link="/a"` による要素は、`/a` で現在のパスが開始する限り、このクラスに適用されるでしょう。

`exact` インラインオプションを使用してパスが正確に一致するとき、アクティブクラスのみ適用されるマッチングの動作を設定することも可能です:

``` html
<a v-link="{ path: '/a', exact: true }"></a>
```

アクティブリンククラス名は、ルーターインスタンスを作成しているとき、`linkActiveClass` オプションで設定することができます。`activeClass` インラインオプションで上書きすることもできます:

``` html
<a v-link="{ path: '/a', activeClass: 'custom-active-class' }"></a>
```

#### 別の要素へアクセスリンククラスの適用

> 0.7.8+

時どき、`<a>` 要素自身よりむしろ `<a>`要素をラップ (wrap) している要素にアクティブリンククラスを適用したいかもしれません。`v-link-active` を親要素に追加することによってそのようにすることもできます:

``` html
<ul>
  <li v-link-active>
    <a v-link="{ path: '/xxx' }">Go</a>
  </li>
</ul>
```

`v-link` は `v-link-active` を持つ最も近い要素を探し、その要素の代わりにアクティブなクラスを適用します。

#### 他の設定オプション

- **replace**

  `replace: true` によるリンクは、ナビゲーションが履歴レコードから離れないため、クリックしたとき `router.go()` の代わりに `router.replace()` を呼び出します。

  ``` html
  <a v-link="{ path: '/abc', replace: true }"></a>
  ```

- **append**

  `append: true` による相対リンクは、常に現在のパスに相対パスを追加します。例えば、我々が `/a` から相対リンク `b` に移動していると仮定すると、`append: true` なしで、我々は `b` で終わりますが、`append: true` ありでは、我々は `/a/b` で終わります。

アクティブリンククラス名は、ルーターインスタンスを作成しているとき、`linkActiveClass` オプションで設定することができます。完全に一致するクラスは、提供されるクラス名に `-exact` 接尾辞 を単に追加することになります。

  ``` html
  <a v-link="{ path: 'relative/path', append: true }"></a>
  ```

#### その他の注意事項

- `v-link` は `<a>` 要素で使用するとき、自動的に `href` 属性に設定します。