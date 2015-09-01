# Installation

### Direct Download

See [dist folder](https://github.com/vuejs/vue-router/tree/dev/dist). Note the dist files are always the latest stable - it's not update-to-date with the `dev` branch source.

### CDN

[jsdelivr](https://cdn.jsdelivr.net/vue.router/0.5.2/vue-router.min.js)

### NPM

``` bash
npm install vue-router
# dev branch
npm install vuejs/vue-router#dev
```

When used in CommonJS, you must explicitly install the router via `Vue.use()`:

``` js
var Vue = require('vue')
var VueRouter = require('vue-router')

Vue.use(VueRouter)
```

You don't need to do this when using the standalone build because it installs itself automatically.

### Bower

``` bash
bower install vue-router
# dev branch
bower install vuejs/vue-router#dev
```
