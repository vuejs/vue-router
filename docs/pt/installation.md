# Instalação

## Download direto / CDN

[https://unpkg.com/vue-router/dist/vue-router.js](https://unpkg.com/vue-router/dist/vue-router.js)

<!--email_off-->
[Unpkg.com](https://unpkg.com) fornece links CDN baseados em NPM. O link acima sempre irá apontar para a versão mais recente disponível no npm. Você pode usar versões especificas também através de URLs como `https://unpkg.com/vue-router@2.0.0/dist/vue-router.js`.
<!--/email_off-->

Importe o `vue-router` depois de importar o Vue.js e isso irá instala-lo automaticamente:

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vue-router.js"></script>
```

## npm

``` bash
npm install vue-router
```

Quando estiver a usar o sistema de modulos, você deve instalar o router de forma explicita via:

``` js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
```

Você não precisa fazer isso quando estiver usando ele globalmente através da tag script.

## Vue CLI

Se você tiver um projeto usando o [Vue CLI](https://cli.vuejs.org/) você pode adicionar o Vue Router como um plugin. Você pode deixar a CLI gerar o codigo acima por você assim como dois exemplos de rotas. **Isso também irá sobrescrever o seu `App.vue`** então certifique-se de fazer uma copia de segurança antes de executar os seguintes comandos dentro do seu projeto:

```sh
vue add router
```

## Versão em desenvolvimento

Você terá de clonar diretamente do GitHub e fazer build do `vue-router` você mesmo, se quiser usar a ultima versão em desenvolvimento.

``` bash
git clone https://github.com/vuejs/vue-router.git node_modules/vue-router
cd node_modules/vue-router
npm install
npm run build
```
