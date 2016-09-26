# HTML5 History モード

`vue-router` のデフォルトは _hash モード_ です - 完全な URL を hash を使ってシミュレートし、 URL が変更された時にページのリロードが起きません。

その hash を取り除くために、ページのリロード無しに URL 遷移を実現する `history.pushState` API を利用したルーターの **history モード** を使うことができます。

``` js
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```

history モードを使用する時は、URL は "普通" に見えます e.g. `http://oursite.com/user/id`。美しいですね!

しかしながら一点問題があります。シングルページのクライアントサイドアプリケーションなので、適切なサーバーの設定をしないと、ユーザーがブラウザで直接 `http://oursite.com/user/id` にアクセスした場合に 404 エラーが発生します。

心配する必要はありません。この問題を直すためには、単純な catch-all フォールバックのためのルートをサーバー側で追加するだけです。もし URL がどの静的なアセットにもマッチしなかった時はあなたのアプリケーションが動作しているのと同じ `index.html` ページで受け付けましょう。これも美しいですね!

## サーバーの設定例

#### Apache

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### nginx

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

#### Node.js (Express)

Node.js/Express では [connect-history-api-fallback middleware](https://github.com/bripkens/connect-history-api-fallback) の利用を検討してください。

## 注意

この点に関して注意があります。全ての not-found パスが `index.html` を提供するため、もはや 404 エラーをサーバーがレポートしなくなります。回避策として、Vue アプリケーション内で 404 ページを表示するために catch-all ルートを実装すべきです。

``` js
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '*', component: NotFoundComponent }
  ]
})
```

他の方法として、もしあなたが Node.js サーバーを使っている場合、入ってきた URL とマッチさせて、マッチしなかった場合に 404 を返答するサーバーサイドのルーターを使って fallback を実装することもできます。
