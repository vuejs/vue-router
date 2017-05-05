# Installation

### Téléchargement direct / CDN

[https://unpkg.com/vue-router/dist/vue-router.js](https://unpkg.com/vue-router/dist/vue-router.js)

<!--email_off-->
[Unpkg.com](https://unpkg.com) met à disposition des liens CDN basés sur NPM. Le lien ci-dessus pointera toujours vers la dernière release publiée sur NPM. Vous pouvez également spécifier une certain-e version/tag via l'URL comme `https://unpkg.com/vue-router@2.0.0/dist/vue-router.js`.
<!--/email_off-->

Inclure `vue-router` après Vue, et il s'installera automatiquement de lui-même :

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vue-router.js"></script>
```

### NPM

``` bash
npm install vue-router
```

Lorsqu'il est utilisé avec un système de module, vous devez explicitement installer le router via `Vue.use()` :

``` js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
```

Vous n'avez pas besoin de faire cela lors de l'utilisation des tags `<script>`.

### Dev Build

Vous aurez besoin de cloner directement `vue-router` depuis GitHub et le construire vous-même si vous souhaitez utiliser la dernière dev build.

``` bash
git clone https://github.com/vuejs/vue-router.git node_modules/vue-router
cd node_modules/vue-router
npm install
npm run build
```
