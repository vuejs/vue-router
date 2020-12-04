# Redirecionar e apelidos (alias)

## Redirecionamento

O redirecionamento também é feito na configuração de `routes`. Redirecionar de `/a` para `/b`:

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: '/b' }
  ]
})
```

A redireção também pode ser apontado a uma rota nomeada:

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: { name: 'foo' }}
  ]
})
```

Ou até usar uma função para redirecionamento dinâmico:

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: to => {
      // a função recebe a rota alvo como argumento
      // retorna redirecionar para o caminho/destino.
    }}
  ]
})
```

Note que as [guardas de navegação](../advanced/navigation-guards.md) não são aplicadas em rotas que redireciona, apenas sobre seus alvos. No exemplo abaixo, adicionar uma sentinela `beforeEnter` para a rota `/a` não teria qualquer efeito.

Para outros usos mais avançados, consulte o [exemplo](https://github.com/vuejs/vue-router/blob/dev/examples/redirect/app.js).

## Apelidos (Alias)

A redirecionar significa que quando o usuário visitar `/a`, a URL irá ser substituida por `/b`, e depois capturado como `/b`. Mas o que é um apelido (alias)?

**Um apelido de `/a` como `/b` significa que quando o usuário visitar `/b`, a URL permanece como `/b`, porém ele será capturado como se o usuário estiver visitando `/a`.**

O que está acima pode ser expressado em uma configuração de rota como:

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/b' }
  ]
})
```

Um apelido dá para você a liberdade de mapear uma estrutura de interface do usuário à uma URL arbitrária, ao invés de ser compelida pela estrutura aninhada da configuração.

Para usos mais avançados, consulte o [exemplo](https://github.com/vuejs/vue-router/blob/dev/examples/route-alias/app.js).
