# Rotas Aninhadas

<div class="vueschool"><a href="https://vueschool.io/lessons/vue-router-nested-routes?friend=vuejs" target="_blank" rel="sponsored noopener" title="Aprenda a usar rotas aninhadas na Vue School">Aprenda a usar rotas aninhadas em uma aula gratuita na Vue School</a></div>

A interfaces de usuários de aplicações reais são comumente compostas de componentes que são aninhados em multíplos níveis de profundidade. É também muito comum que seções de uma URL correspondam a certas estruturas aninhadas de componentes, por exemple:

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

Com o `vue-router`, é muito símples expressar essa relação usando a configurações de rotas aninhadas.

Dada a aplicação criada por nós no último capitulo:

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

O `<router-view>` aqui é uma saída de nível superior. Ele renderiza o componente que corresponde a uma rota de nível superior. Similarmente, um componente renderizado pode também conter sua própria, `<router-view>` aninhada. Por exemplo, se nós adicionar-mos um dentro do template dos componentes do `User`:

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

Para renderizar componentes dentro desta saída aninhada, nós precisamos usar a opção `children` na configuração do construtor `VueRouter`:

``` js
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User,
      children: [
        {
          // UserProfile irá ser renderizado dentro de <router-view> do User
          // quando /user/:id/profile for capturado
          path: 'profile',
          component: UserProfile
        },
        {
          // UserPosts irá ser renderizado dentro de <router-view> do User
          // quando /user/:id/posts for capturado
          path: 'posts',
          component: UserPosts
        }
      ]
    }
  ]
})
```

**Note que caminhos aninhados que começam com `/` irão ser tratados como um caminho raiz(root). Isto permite você influenciar o componente aninhado sem ter que usar uma URL aninhada.**


Como você pode observar a opção `children` é apenas outra Array de objetos de configuração de rota como `routes` mesmo. Longo, você pode preservar views aninhadas tanto como você precisar.

A este ponto, com a configuração de cima, quando você visitar `/user/foo`, nada será renderizado dentro da saída do `User`, porque nenhuma subrota é capturada. Talvez você queira renderizar alguma coisa alí. Neste caso você pode prover uma caminho para uma sub rota vazia:

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id', component: User,
      children: [
        // UserHome irá ser renderizada dentro da <router-view> do User
        // quando /user/:id for capturada
        { path: '', component: UserHome },

        // ...outras sub rotas
      ]
    }
  ]
})
```
A exemplo funcionando pode ser achando [aqui](https://jsfiddle.net/yyx990803/L7hscd8h/).
