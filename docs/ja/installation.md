# インストール

### 直接ダウンロード / CDN

[https://unpkg.com/vue-router](https://unpkg.com/vue-router)

[Unpkg.com](https://unpkg.com) は NPM ベースの CDN リンクです。 上記のリンクは常に NPM 上の最新のリリースを指します。 `https://unpkg.com/vue-router@2.0.0` のような URL を利用することで特定のバージョンやタグを指定することもできます。

Vue の後に `vue-router` を含めると自動的にインストールされます。

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vue-router.js"></script>
```

### NPM

``` bash
npm install vue-router
```

モジュールシステムを使う場合、`Vue.use()` を使って明示的にルーターをインストールする必要があります。

``` js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
```

グローバルな script タグを使っている場合は必要ありません。

### 開発用ビルド

もし最新の開発用ビルドを使用したい場合は、GitHub から直接クローンして `vue-router` をご自身でビルドしてください。

``` bash
git clone https://github.com/vuejs/vue-router.git node_modules/vue-router
cd node_modules/vue-router
npm install
npm run build
```
