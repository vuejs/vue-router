# インストール

### 直接ダウンロード

[dist フォルダ](https://github.com/vuejs/vue-router/tree/dev/dist)を参照してください。dist フォルダにあるファイルは常に最新の安定版であることに注意してください。`dev` ブランチのソースで更新されません。

### CDN

[jsdelivr](https://cdn.jsdelivr.net/vue.router/0.5.2/vue-router.min.js)

### NPM

``` bash
npm install vue-router
# dev ブランチ
npm install vuejs/vue-router#dev
```

CommonJS で使用されるとき、明示的に `Vue.use()` 経由でルータはインストールされなければなりません:

``` js
var Vue = require('vue')
var VueRouter = require('vue-router')

Vue.use(VueRouter)
```

スタンドアロンビルドを使用しているときは、それ自身自動的にインストールされるため、これを実行する必要はありません。

### Bower

``` bash
bower install vue-router
# dev ブランチ
bower install vuejs/vue-router#dev
```
