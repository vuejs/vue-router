# Installation

### Direct Download

See [dist folder](https://github.com/vuejs/vue-router/tree/dev/dist). Note the dist files are always the latest stable - it's not update-to-date with the `dev` branch source.

### CDN
[jsdelivr](https://cdn.jsdelivr.net/vue.router/0.7.10/vue-router.min.js)

[cdnjs](https://cdnjs.cloudflare.com/ajax/libs/vue-router/0.7.10/vue-router.min.js)

### NPM

``` bash
npm install vue-router
```

When used in CommonJS, you must explicitly install the router via `Vue.use()`:

``` js
var Vue = require('vue')
var VueRouter = require('vue-router')

Vue.use(VueRouter)
```

You don't need to do this when using the standalone build because it installs itself automatically.

### Dev Build

You will have to clone directly from GitHub and build `vue-router` yourself if you want to use the latest dev build.

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
