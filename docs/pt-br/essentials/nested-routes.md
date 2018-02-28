# Rotas Aninhadas

As UI de aplicativos reais geralmente são compostas por componentes que estão aninhados em vários níveis de profundidade. Também é muito comum que os segmentos de um URL correspondam a uma certa estrutura de componentes aninhados, por exemplo:

```
/user/foo/profile                     /user/foo/posts
+------------------+                  +-----------------+
| User             |                  | User            |
| +--------------+ |                  | +-------------+ |
| | Profile      | |  +------------>  | | Posts       | |
| |              | |                  | |             | |
| +--------------+ |                  | +-------------+ |
+------------------+                  +-----------------+
```

Com `vue-router`, é muito simples expressar esse relacionamento usando configurações de rota aninhadas.

Dado o aplicativo que criamos no último capítulo:

``` html
<div id="app">
  <router-view></router-view>
</div>
```

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

O `<router-view>` aqui é uma saída de nível superior. Isso torna o componente combinado por uma rota de nível superior. Da mesma forma, um componente renderizado também pode conter sua própria `<router-view>` aninhada. Por exemplo, se adicionarmos um dentro do modelo do componente `User`:

``` js
const User = {
  template: `
    <div class="user">
      <h2>User {{ $route.params.id }}</h2>
      <router-view></router-view>
    </div>
  `
}
```

Para tornar os componentes nesta saída aninhada, precisamos usar a opção `children` na configuração do construtor `VueRouter`:

``` js
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User,
      children: [
        {
          // UserProfile will be rendered inside User's <router-view>
          // when /user/:id/profile is matched
          path: 'profile',
          component: UserProfile
        },
        {
          // UserPosts will be rendered inside User's <router-view>
          // when /user/:id/posts is matched
          path: 'posts',
          component: UserPosts
        }
      ]
    }
  ]
})
```

** Observe que os caminhos aninhados que começam com `/` serão tratados como um caminho raiz. Isso permite que você aproveite o aninhamento de componentes sem ter que usar um URL aninhado. **

Como você pode ver, a opção `children` é apenas outra matriz de objetos de configuração de rotas como `routes`  em si. Portanto, você pode manter as visualizações de nidificação tanto quanto você precisar.

Neste ponto, com a configuração acima, quando você visita `/user/foo`, nada será processado dentro da saída do `User`'s, porque nenhuma sub-rota é correspondida. Talvez você queira renderizar algo lá. Nesse caso, você pode fornecer um caminho de sub-rotas vazio:

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id', component: User,
      children: [
        // UserHome will be rendered inside User's <router-view>
        // when /user/:id is matched
        { path: '', component: UserHome },

        // ...other sub routes
      ]
    }
  ]
})
```

Você pode visualizar uma demo [aqui](https://jsfiddle.net/yyx990803/L7hscd8h/).
