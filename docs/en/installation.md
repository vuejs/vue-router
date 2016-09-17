# Installation

### Direct Download

See [dist folder](https://github.com/vuejs/vue-router/tree/dev/dist). Note the
dist files are always the latest stable - it's not update-to-date with the `dev`
branch source.

### CDN
Available on
[jsdelivr](https://cdn.jsdelivr.net/vue.router/2.0.0-rc.3/vue-router.min.js) or
[cdnjs](https://cdnjs.cloudflare.com/ajax/libs/vue-router/2.0.0-rc.3/vue-router.min.js)
(takes some time to sync so the latest version might not be available yet)

Alternatively you can use
[npmcdn](https://npmcdn.com/vue-router@next/dist/vue-router.js) which will
reflect the latest published version to npm. This is the preferred version when
creating reproductions for bugs.



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

You don't need to do this when using the standalone build because it installs
itself automatically.

### Dev Build

You will have to clone directly from GitHub and build `vue-router` yourself if
you want to use the latest dev build.

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

### Trouble shooting for vue-router 2.0
If the Vue 2.0 project is created by vue-cli using webpack-simple-2.0 template.
It's necessary to add alias setting in webpack.config.js before using vue-router.
```
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.js'
    }
  },
```
Without this setting and import from 'vue/dist/vue.js', some other plugins would work incorrectly such as vuex and vue-i18n.
