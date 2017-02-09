# Instalación

### Descarga directa / CDN

[https://unpkg.com/vue-router/dist/vue-router.js](https://unpkg.com/vue-router/dist/vue-router.js)

<!--email_off-->
[Unpkg.com](https://unpkg.com) provee enlaces a CDN basadas en NPM. El enlace anterior siempre apuntará a la última versión en NPM. También puede usar una versión/etiqueta específica a través de URLs como`https://unpkg.com/vue-router@2.0.0/dist/vue-router.js`.
<!--/email_off-->

Incluya `vue-router` luego de Vue y se instalará automáticamente:

``` html
<script src="/ruta/a/vue.js"></script>
<script src="/ruta/a/vue-router.js"></script>
```

### NPM

``` bash
npm install vue-router
```

Cuando lo use con un sistema de empaquetamiento de módulos, debe instalarlo explícitamente a través de `Vue.use()`:

``` js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
```

No necesita hacer esto cuando utilice etiquetas _script_ globales.

### Versión de desarrollo

Deberá clonar el repositorio directamente desde GitHub y construir `vue-router` usted mismo si quiere utilizar la última versión de desarrollo.

``` bash
git clone https://github.com/vuejs/vue-router.git node_modules/vue-router
cd node_modules/vue-router
npm install
npm run build
```
