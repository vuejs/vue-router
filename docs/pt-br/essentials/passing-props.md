# Passando Props para Componentes de Rota

O uso de `$route` no seu componente cria um acoplamento apertado com a rota que limita a flexibilidade do componente, pois só pode ser usado em determinados URLs.

Para desacoplar este componente da opção de uso do roteador `props`:

**Em vez de acoplar a `$route`:**

``` js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User }
  ]
})
```

**Desacople-o usando `props`**

``` js
const User = {
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User, props: true },

    // for routes with named views, you have to define the `props` option for each named view:
    {
      path: '/user/:id',
      components: { default: User, sidebar: Sidebar },
      props: { default: true, sidebar: false }
    }
  ]
})
```

Isso permite que você use o componente em qualquer lugar, o que torna o componente mais fácil de reutilizar e testar.

### Modo booleano

Quando `props` é definido como `true`, o `route.params` será configurado como o componente adereços.

### Modo de objeto

Quando `props` é um objeto, isso será configurado como o componente como suporte. Útil para quando os adereços são estáticos.

``` js
const router = new VueRouter({
  routes: [
    { path: '/promotion/from-newsletter', component: Promotion, props: { newsletterPopup: false } }
  ]
})
```

### Modo de função

Você pode criar uma função que retorna adereços. Isso permite que você elimine parâmetros em outros tipos, combine valores estáticos com valores baseados na rota, etc.

``` js
const router = new VueRouter({
  routes: [
    { path: '/search', component: SearchUser, props: (route) => ({ query: route.query.q }) }
  ]
})
```

A URL `/search?q=vue` assaria `{query: 'vue'}` como adereços para o componente `SearchUser`.

Tente manter a função `props` sem estado, pois é apenas avaliada nas mudanças na rota. Use um componente wrapper se precisar de estado para definir os adereços, dessa forma vue pode reagir às mudanças de estado.

Para uso avançado, confira o [exemplo](https://github.com/vuejs/vue-router/blob/dev/examples/route-props/app.js).