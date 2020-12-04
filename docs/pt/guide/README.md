# Dando início

:::tip Nota
Nós estaremos usando [ES2015](https://github.com/lukehoban/es6features) dentro dos exemplos de código dentro do guia.

Também, todos os exemplos irão estar utilizando a versão completa do Vue para tornar a compilação do template possível. Saiba mais detalhes [aqui](https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only).
:::

<div class="vueschool"><a href="https://vueschool.io/courses/vue-router-for-everyone?friend=vuejs" target="_blank" rel="sponsored noopener" title="Aprenda como construir poderosas single page applications usando o Vue Router na Vue School">Assista gratuitamente um curso em vídeo sobre o Vue Router na Vue School</a></div>

A criação de uma Single-page Application usando o Vue + Vue Router é muitos simples. Com o Vue.js, nós estamos prontos para constuir nossa aplicação usando componentes. Quando adicionamos o Vue Router a essa mistura, tudo o que nós precisamos é mapear nossos componentes dentro das rotas e deixar o Vue Router saber onde renderiza-los. Aqui está um exemplo básico:

## HTML

```html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>

<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- use o componente router-link para a navegação. -->
    <!-- especifique o link passando ele para a propriedade `to`. -->
    <!-- `<router-link>` irá ser renderizado como uma tag `<a>` por padrão -->
    <router-link to="/foo">Go to Foo</router-link>
    <router-link to="/bar">Go to Bar</router-link>
  </p>
  <!-- route outlet -->
  <!-- o componente que corresponder a rota irá ser renderizado aqui -->
  <router-view></router-view>
</div>
```

## JavaScript

```js
// 0. Se estiver usando o sistema de modulos (por exemplo via vue-cli), importe Vue e o VueRouter
// e depois chame `Vue.use(VueRouter)`.

// 1. Defina rotas para componentes.
// Estes podem ser importados a partir de outros arquivos
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. Defina algumas rotas
// Cada rota deve corresponder a um componente. O "component" pode
// ser qualquer construdor de componente criado via
// `Vue.extend()`, ou apenas um objeto de opções de componente.
// Nós iremos tocar no assunto de rotas aninhadas mais tarde.
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 3. Cria uma instância de router e passe as opções de `rotas`
// Você pode adicionar as opções aqui, mas vamos
// manter as coisas simples por agora.
const router = new VueRouter({
  routes // abreviação para `routes: routes`
})

// 4. Cria e depois monta a instância root.
// Certifique-se de injetar o router com as opções de rotas para iniciar
// a obserção de todas as rotas da aplicação.
const app = new Vue({
  router
}).$mount('#app')

// Agora a aplicação está iniciada!
```

Ao injetar o router, nós ganhamos acesso a ele através do `this.$router` como também a rota atual através do `this.$route` dentro de qualquer componente:

```js
// Home.vue
export default {
  computed: {
    username() {
      // Nós iremos ver que `params` está abreviado
      return this.$route.params.username
    }
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    }
  }
}
```

Ao longo da documentação, nós iremos algumas vezes usar a instâcia `router`. Lembresse de que `this.$router` é exatamente o mesmo que usar `router`. A razão que nos leva a usar o `this.$router` é por não querermos importar o router em cada componente que precise manipular rotas.

Você também pode dar uma espreitadela neste exemplo [ao vivo](https://jsfiddle.net/yyx990803/xgrjzsup/).

Repare que uma `<router-link>` recebe de forma automatica a classe `.router-link-active` quando usa rota é acessada. Você pode aprender mais sobre ele consultando a [referência da sua API](../api/#router-link).
