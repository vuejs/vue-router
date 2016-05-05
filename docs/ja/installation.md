# インストール

### 直接ダウンロード

[dist フォルダ](https://github.com/vuejs/vue-router/tree/dev/dist)を参照してください。dist フォルダにあるファイルは常に最新の安定版であることに注意してください。`dev` ブランチのソースで更新されません。

### CDN
[jsdelivr](https://cdn.jsdelivr.net/vue.router/0.7.10/vue-router.min.js)

[cdnjs](https://cdnjs.cloudflare.com/ajax/libs/vue-router/0.7.10/vue-router.min.js)

### NPM

``` bash
npm install vue-router
```

CommonJS で使用されるとき、明示的に `Vue.use()` 経由でルータはインストールされなければなりません:

``` js
var Vue = require('vue')
var VueRouter = require('vue-router')

Vue.use(VueRouter)
```

スタンドアロンビルドを使用しているときは、それ自身自動的にインストールされるため、これを実行する必要はありません。

### Dev ビルド

最新の開発版を使用したい場合は、GitHub から直接 clone して `vue-router` をあなた自身でビルドしなければなりません。

``` bash
git clone https://github.com/vuejs/vue-router.git node_modules/vue-router
cd node_modules/vue-router
npm install
npm run build
```

### Bower

``` bash
bower install vue-router
```
