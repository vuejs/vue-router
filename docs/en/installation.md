# Installation

### Direct Download / CDN

Unpkg.com provides NPM-based CDN links. The latest release is available at [https://unpkg.com/vue-router@latest/dist/vue-router.js](https://unpkg.com/vue-router@latest/dist/vue-router.js) - you can also specify any other versions/tags available on NPM!

### NPM

``` bash
npm install vue-router
```

When used with a module system, you must explicitly install the router via `Vue.use()`:

``` js
import Vue from 'vue'
import VueRouter from 'vue-router'

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
