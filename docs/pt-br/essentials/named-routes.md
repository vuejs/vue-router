# Rotas nomeadas

Às vezes, é mais conveniente identificar uma rota com um nome, especialmente quando se liga a uma rota ou realiza navegações. Você pode dar a uma rota um nome nas opções `routes` ao criar a instância do roteador:

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

Para vincular a uma rota nomeada, você pode passar um objeto para o `router-link` componentes `to` prop:

``` html
<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
```

Este é exatamente o mesmo objeto usado programaticamente com `router.push()`:

``` js
router.push({ name: 'user', params: { userId: 123 }})
```

Em ambos os casos, o roteador irá navegar até o caminho `/user/123`.

Exemplo [aqui](https://github.com/vuejs/vue-router/blob/dev/examples/named-routes/app.js).