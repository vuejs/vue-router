# Iniciando

> Vamos usar [ES2015](https://github.com/lukehoban/es6features) nos exemplos de código no guia.

Criar uma Single-page Application com o Vue + Vue Router é simples. Com Vue.js, já estamos compondo nossa aplicação com componentes. Ao adicionar o vue-router, tudo o que precisamos fazer é mapear nossos componentes para as rotas e deixar a vue-router saber onde os renderizar. Aqui está um exemplo básico:

> Todos os exemplos estarão usando a versão completa do Vue para tornar a análise de modelo possível. Veja mais detalhes [Aqui](https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only).

### HTML

``` html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>

<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- use router-link component for navigation. -->
    <!-- specify the link by passing the `to` prop. -->
    <!-- `<router-link>` will be rendered as an `<a>` tag by default -->
    <router-link to="/foo">Go to Foo</router-link>
    <router-link to="/bar">Go to Bar</router-link>
  </p>
  <!-- route outlet -->
  <!-- component matched by the route will render here -->
  <router-view></router-view>
</div>
```

### JavaScript

``` js
// 0. If using a module system (e.g. via vue-cli), import Vue and VueRouter
// and then call `Vue.use(VueRouter)`.

// 1. Define route components.
// These can be imported from other files
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
// We'll talk about nested routes later.
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes // short for `routes: routes`
})

// 4. Create and mount the root instance.
// Make sure to inject the router with the router option to make the
// whole app router-aware.
const app = new Vue({
  router
}).$mount('#app')

// Now the app has started!
```

Ao injetar o roteador, temos acesso a ele como `this.$router`, bem como a rota atual como `this.$route` dentro de qualquer componente:

```js
// Home.vue
export default {
  computed: {
    username () {
      // We will see what `params` is shortly
      return this.$route.params.username
    }
  },
  methods: {
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    }
  }
}
```

Ao longo dos documentos, costumamos usar a instância do `router`. Tenha em mente que `this.$router` é exatamente o mesmo que usar `router`. A razão pela qual usamos `this.$router` é porque não queremos importar o roteador em todos os componentes que precisem manipular o roteamento.

Você também pode verificar este exemplo [Veja](https://jsfiddle.net/yyx990803/xgrjzsup/).

Observe que um `<router-link>` recebe automaticamente a classe `.router-link-active` quando sua rota de destino é correspondida. Você pode aprender mais sobre isso em sua [Documentação da API](../api/router-link.md).