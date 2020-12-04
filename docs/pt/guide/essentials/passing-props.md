# Passando Propriedade para Componentes de Rotas

<div class="vueschool"><a href="https://vueschool.io/lessons/how-to-pass-vue-router-params-as-props-to-components?friend=vuejs" target="_blank" rel="sponsored noopener" title="Aprenda a como passar props para componente de rota na Vue School">Aprenda a como passar props para componente de rota na Vue School em uma aula gratuita na Vue School</a></div>

Use `$route` no seu componente para criar uma união estreita com a rota que limita a flexibilidade do componente como se ela pudesse somente ser usada em certas URLs.

Para desmantelar este componente a partir do router use a opção `props`:

**Ao invés de unir a `$route`:**

```js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
const router = new VueRouter({
  routes: [{ path: '/user/:id', component: User }]
})
```

**Desmantele ele pelo uso de `props`**

```js
const User = {
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User, props: true },

    // para rotas com views nomeadas, você tem de definir a opção `props` para cada view nomeada:
    {
      path: '/user/:id',
      components: {
        default: User,
        sidebar: Sidebar
      },
      props: {
        default: true,
        // modo função, mais sobre isto abaixo
        sidebar: route => ({ search: route.query.q })
      }
    }
  ]
})
```

Isto permite você usar o componente em qualquer lugar, que torna o componente fácil de reusar e testar.

## Modo Booliano

Quando `props` é configurado como `true`, a `route.params` irá ser configurado como o props do componente.

## Modo Objeto

Quando `props` é um objeto, isto será configurado como as props do componente como é. Útil para quando as props são estáticas.

```js
const router = new VueRouter({
  routes: [
    {
      path: '/promotion/from-newsletter',
      component: Promotion,
      props: { newsletterPopup: false }
    }
  ]
})
```

## Modo Função

Você pode criar uma função que retorna props. Isto permite você mudar os parametros para outros tipos, combine valores estáticos com valores baseados em rotas, etc.

```js
const router = new VueRouter({
  routes: [
    {
      path: '/search',
      component: SearchUser,
      props: route => ({ query: route.query.q })
    }
  ]
})
```

A URL `/search?q=vue` deveria passar `{query: 'vue'}` como props para o componente `SearchUser`.

Tente manter a função de `props` sem estado, para ser somente ser interpretado na mudança de rota. Use um wrapper de componente se você precisar de estado para definir as props, que de alguma maneira vue poderia reagir a mudanças de estado.

Para usos mais avançados, consulte o [exemplo](https://github.com/vuejs/vue-router/blob/dev/examples/route-props/app.js).
