# Instalação

### Download Direto / CDN

[https://unpkg.com/vue-router/dist/vue-router.js](https://unpkg.com/vue-router/dist/vue-router.js)

<!--email_off-->
[Unpkg.com](https://unpkg.com) fornece links de CDN baseado no npm. O link acima vai sempre apontar para o ultimo lançamento no npm. Você também pode usar uma versão/tag específica através de URLs como
 `https://unpkg.com/vue-router@2.0.0/dist/vue-router.js`.
<!--/email_off-->

Inclua `vue-router` depois do Vue e isto vai instalar-se automaticamente:

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vue-router.js"></script>
```

### npm

``` bash
npm install vue-router
```

Quando usado com um sistema de módulos, você deve explicitamente instalar o router via `Vue.use()`:

``` js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
```

Você não precisa fazer isso quando estiver usando tags script globais.

### Dev Build

Você terá que clonar diretamente do Github e construir (build) `vue-router` por si
se você quiser usar o dev build mais recente.

``` bash
git clone https://github.com/vuejs/vue-router.git node_modules/vue-router
cd node_modules/vue-router
npm install
npm run build
```
