# Redirecionar e Alias

### Redirecionar

O redirecionamento também é feito na configuração `routes`. Para redirecionar `/a` para `/b`:

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: '/b' }
  ]
})
```

O redirecionamento também pode ser direcionado para uma rota nomeada:

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: { name: 'foo' }}
  ]
})
```

Ou mesmo use uma função para redirecionamento dinâmico:

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: to => {
      // the function receives the target route as the argument
      // return redirect path/location here.
    }}
  ]
})
```

Observe que [Navigation Guards](../advanced/navigation-guards.md) o são aplicadas na rota que redireciona, apenas no seu destino. No exemplo abaixo, adicionar uma proteção `beforeEnter` ou `beforeLeave` à rota `/a` não teria nenhum efeito.

Para outros usos avançados, marque o [exemplo](https://github.com/vuejs/vue-router/blob/dev/examples/redirect/app.js).

### Alias

Um redirecionamento significa que quando o usuário visita `/a`, e o URL será substituído por `/b` e, em seguida, será igual a `/b`. Mas o que é um alias?

**Um alias de `/a` como `/b` significa que quando o usuário visita `/b`, a URL permanece `/b`, mas será correspondido como se o usuário estivesse visitando `/a`.**

O acima pode ser expresso na configuração da rota como:

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/b' }
  ]
})
```

Um alias dá-lhe a liberdade de mapear uma estrutura de UI para um URL arbitrário, em vez de ser restringido pela estrutura de aninhamento da configuração.

Para uso avançado, confira o [exemplo](https://github.com/vuejs/vue-router/blob/dev/examples/route-alias/app.js).