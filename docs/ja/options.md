# Route オプション

ルーターインスタンスを作成するときにルーターの動作をカスタマイズして使用できるオプションがいくつかあります。

#### hashbang

- デフォルト: true
- hash モードでのみ使用されます

  hashbang オプションが true のとき、全ての hash パスは `#!` で開始するフォーマットになります。例えば、`route.go('/foo/bar')` はブラウザの URL を `example.com/#!/foo/bar` に設定します。

#### history

- デフォルト: false

  HTML5 history モードを有効にします。履歴管理のために `history.pushState()` と `history.replaceState()` を活用します。

  **Note**: history モードを使用するとき、サーバーは、あなたのサイトの深いリンクに直接訪問しているユーザーが 404 を取得しないよう、[適切に設定](http://readystate4.com/2012/05/17/nginx-and-apache-rewrite-to-support-html5-pushstate/)する必要があります。

####  abstract

- デフォルト: false

  ブラウザに依存しない abstract history backend を使用します。abstract モードでは実際の URL が重要ではないテストなどの環境で役に立ちます。例えば、Electron または Cordova のようなアプリケーションです。ルーターはもし、ブラウザ以外の環境でロードした場合、abstract モードにフォールバックします。

#### root

- デフォルト: null
- HTML5 history モードのみ使用されます

  全てのルーターナビゲーションに対して root パスを定義します。route 設定で使用される全てのパス、`router.go()`、`v-link`、そしてこの root パスに相対解決された route オブジェクトが公開され、さらに root パスは実際のブラウザ URL に常に含まれています。

  例えば、`root: '/foo'` では、`v-link="/bar"` はブラウザ URL に `/foo/bar` に設定します。直接的に `/foo/bar` へのアクセスは、あなたの route 設定で `/bar` に対してマッチします。

  ほとんどの場合、`root` は設定するだけです: あなたのアプリケーションのコードで心配する必要はありません。

#### linkActiveClass

- デフォルト: `"v-link-active"`

  現在のリンクがアクティブであるとき、クラスは `v-link` 要素に適用されるように設定します。マッチングの振る舞いとクラスは、個別に各 `v-link` に構成することができます。

#### saveScrollPosition

- デフォルト: false
- HTML5 history モードのみ使用されます

  このオプションは、ユーザーがブラウザの"戻る"ボタンを使ったときスクロール位置を復元するために、HTML5 history `popstate` イベントに関連付けられている状態を利用します。これは、あなたの `<router-view>` がトランジションのエフェクトを持っている場合、期待された動作がしない場合があります。

#### transitionOnLoad

- デフォルト: false

  初期ロードの `<router-view>` に対してトランジションのエフェクトを適用するかどうか。デフォルトでは、初期ロードでマッチしたコンポーネントが即座にレンダリングされます。

#### suppressTransitionError

- デフォルト: false

  もし `true` に設定する場合、トランジションフック内部でキャッチされていないエラーが抑えられます。
