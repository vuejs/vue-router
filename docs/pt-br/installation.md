# Instalação

### Download direto / CDN

[https://unpkg.com/vue-router/dist/vue-router.js](https://unpkg.com/vue-router/dist/vue-router.js)

<!--email_off-->
[Unpkg.com](https://unpkg.com) fornece links CDN baseados em npm. O link acima sempre apontará para a última versão em npm. Você também pode usar uma versão/tag específica via URLs como `https://unpkg.com/vue-router@2.0.0/dist/vue-router.js`.
<!--/email_off-->

Inclua `vue-router` após o Vue e ele se instalará automaticamente:

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vue-router.js"></script>
```

### npm

``` bash
npm install vue-router
```

Quando usado com um sistema de módulos, você deve instalar o roteador explicitamente através do `Vue.use ()`:

``` js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
```

Você não precisa fazer isso ao usar tags de script globais.

### Dev Build

Você terá que clonar diretamente do GitHub e criar `vue-router` se
você deseja usar o desenvolvimento mais recente.

``` bash
git clone https://github.com/vuejs/vue-router.git node_modules/vue-router
cd node_modules/vue-router
npm install
npm run build
```
