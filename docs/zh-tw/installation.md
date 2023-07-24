
# 安裝

### 直接下載 / CDN

[https://unpkg.com/vue-router/dist/vue-router.js](https://unpkg.com/vue-router/dist/vue-router.js)

<!--email_off-->
[Unpkg.com](https://unpkg.com) 提供了基於 NPM 的 CDN 連結。上面的連結會一直指向在 NPM 發佈的最新版本。你也可以像  `https://unpkg.com/vue-router@2.0.0/dist/vue-router.js` 這樣指定 版>本號 或者 Tag。
<!--/email_off-->

在 Vue 後面加載 `vue-router`，它會自動安裝的：

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vue-router.js"></script>
```

### NPM

``` bash
npm install vue-router
```

如果在一個模組化工程中使用它，必須要通過 `Vue.use()` 明確地安裝路由功能：

``` js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
```

如果使用全局的 script 標籤，則無須如此（手動安裝）。

### 構建開發版

如果你想使用最新的開發版，就得從 GitHub 上直接 clone，然後自己 build 一個 `vue-router`。

``` bash
git clone https://github.com/vuejs/vue-router.git node_modules/vue-router 
npm install 
npm run build 
```
                                                                                                                                                                    1,1         
