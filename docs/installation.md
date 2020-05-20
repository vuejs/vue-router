# Installation

## Direct Download / CDN

[https://unpkg.com/vue-router/dist/vue-router.js](https://unpkg.com/vue-router/dist/vue-router.js)

<!--email_off-->
[Unpkg.com](https://unpkg.com) provides npm-based CDN links. The above link will always point to the latest release on npm. You can also use a specific version/tag via URLs like `https://unpkg.com/vue-router@2.0.0/dist/vue-router.js`.
<!--/email_off-->

Include `vue-router` after Vue and it will install itself automatically:

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vue-router.js"></script>
```

## npm

``` bash
npm install vue-router
```

When used with a module system, you must explicitly install the router via `Vue.use()`:

``` js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
```

You don't need to do this when using global script tags.

## Vue CLI

If you have a project using [Vue CLI](https://cli.vuejs.org/) you can add Vue Router as a plugin. You can let the CLI generate the code above for you as well as two sample routes. **It will also overwrite your `App.vue`** so make sure to backup the file before running the following command inside your project:

```sh
vue add router
```

## Dev Build

You will have to clone directly from GitHub and build `vue-router` yourself if
you want to use the latest dev build.

``` bash
git clone https://github.com/vuejs/vue-router.git node_modules/vue-router
cd node_modules/vue-router
npm install
npm run build
```
