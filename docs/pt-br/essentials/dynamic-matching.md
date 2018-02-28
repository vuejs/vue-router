# Rotas dinâmicas

Muitas vezes, precisamos mapear rotas com o padrão fornecido para o mesmo componente. Por exemplo, podemos ter um componente `User` que deve ser renderizado para todos os usuários, mas com diferentes IDs de usuário. Em `vue-router` podemos usar um segmento dinâmico no caminho para conseguir isso:

``` js
const User = {
  template: '<div>User</div>'
}

const router = new VueRouter({
  routes: [
    // dynamic segments start with a colon
    { path: '/user/:id', component: User }
  ]
})
```

Agora, URLs como `/user/foo` e `/user/bar` serão ambos mapeados para a mesma rota.

Um segmento dinâmico é denotado por dois pontos `:`. Quando uma rota é combinada, o valor dos segmentos dinâmicos será exposto como `this.$route.params` em todos componentes. Portanto, podemos renderizar a ID do usuário atual atualizando `User`'s modelo para isso:

``` js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
```

Você pode verificar um exemplo online [aqui](https://jsfiddle.net/yyx990803/4xfa2f19/).

Você pode ter múltiplos segmentos dinâmicos na mesma rota e eles mapearão para campos correspondentes em `$route.params`. Exemplos:

| pattern | matched path | $route.params |
|---------|------|--------|
| /user/:username | /user/evan | `{ username: 'evan' }` |
| /user/:username/post/:post_id | /user/evan/post/123 | `{ username: 'evan', post_id: 123 }` |

Além de `$route.params`, o `$route` O objeto também expõe outras informações úteis, como `$route.query` (se houver uma consulta na URL), `$route.hash`, etc. Você pode verificar os detalhes completos na [Documentação da API](../api/route-object.md).

### Reagindo às mudanças de Params

Uma coisa a notar ao usar rotas com params é que, quando o usuário navega a partir de `/user/foo` para `/user/bar`, **a mesma instância do componente será reutilizada**. Uma vez que ambas as rotas representam o mesmo componente, isso é mais eficiente do que remover a instância antiga e depois criar uma nova. **No entanto, isso também significa que os ganchos do ciclo de vida do componente não serão chamados**.

Para reagir às mudanças de params no mesmo componente, você pode simplesmente assistir o objeto `$route`:

``` js
const User = {
  template: '...',
  watch: {
    '$route' (to, from) {
      // react to route changes...
    }
  }
}
```

Ou use o controle `beforeRouteUpdate` introduzido em 2.2:

``` js
const User = {
  template: '...',
  beforeRouteUpdate (to, from, next) {
    // react to route changes...
    // don't forget to call next()
  }
}
```

### Padrões avançados de correspondência

`vue-router` Use [path-to-regexp](https://github.com/pillarjs/path-to-regexp) como seu mecanismo de correspondência de trilhas, por isso ele suporta muitos padrões de correspondência avançados, como segmentos dinâmicos opcionais, zero ou mais/um ou mais requisitos e até mesmo padrões regex personalizados. Confira a sua [documentação](https://github.com/pillarjs/path-to-regexp#parameters) para esses padrões avançados, e [esse exemplo](https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js) para usá-lo em `vue-router`.

### Prioridades de correspondência

Às vezes, a mesma URL pode ser combinado por rotas múltiplas. Nesse caso, a prioridade correspondente é determinada pela ordem da definição da rota: quanto antes uma rota é definida, maior prioridade ela obtém.