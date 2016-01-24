# 安装

### 直接下载

查看 [dist 目录](https://github.com/vuejs/vue-router/tree/dev/dist). 注意，dist 目录下的文件是最新稳定版，不会同步更新到 `dev` 分支上的最新代码

### CDN
[jsdelivr](https://cdn.jsdelivr.net/vue.router/0.7.10/vue-router.min.js)

[cdnjs](https://cdnjs.cloudflare.com/ajax/libs/vue-router/0.7.10/vue-router.min.js)

### NPM

``` bash
npm install vue-router
```

如果使用 CommonJS 模块规范, 需要显式的使用 `Vue.use()` 安装路由模块：

``` js
var Vue = require('vue')
var VueRouter = require('vue-router')

Vue.use(VueRouter)
```

使用独立编译文件是不需要这样做，因为路由模块会自动安装。

### Dev Build

如果想要使用最新的 dev 版本，需要直接从 GitHub clone 然后自己构建。

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
