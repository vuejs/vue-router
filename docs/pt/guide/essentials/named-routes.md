# Rotas Nomeadas

<div class="vueschool"><a href="https://vueschool.io/lessons/vue-router-named-routes-and-params?friend=vuejs" target="_blank" rel="sponsored noopener" title="Aprenda a como trabalhar com rotas nomeadas e parametros com a Vue School">Aprenda a como trabalhar com rotas nomeadas e parametros com a Vue School</a></div>

Algumas vezes é mais conveniente identificar uma rota com um nome, especialmente quando ligamos a uma rota ou realizamos navegações. Você pode atribuir a uma rota um nome nas opções de rotas do `routes` enquanto cria a instância Router:

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:userId',
      name: 'user',
      component: User
    }
  ]
})
```

Para se ligar a uma rota nomeada, você pode passar um objeto para a propriedade do `router-link` com o nome `to`.

``` html
<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
```

Isto é exata o mesmo objeto usado programaticamente com `router.push()`:

``` js
router.push({ name: 'user', params: { userId: 123 }})
```

Em ambos casos, o router irá navegar até o caminho `/user/123`.

Exemplo completo [aqui](https://github.com/vuejs/vue-router/blob/dev/examples/named-routes/app.js).
