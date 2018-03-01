# Correspondência de Rota Dinâmica

Muitas vezes, teremos de mapear rotas com o padrão dado para o mesmo componente. Por exemplo, podemos ter um componente `User` que deve ser renderizado para todos os usuários, mas com IDs de usuário diferentes. Em `Vue-router` podemos usar um segmento dinâmico no path (caminho) para conseguir isso:

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

Agora URLs como `/user/foo` e `/user/bar` vão ser ambos mapeados para a mesma rota.

Um segmento dinâmico é indicado por um dois-pontos `:`. Quando uma rota é correspondida, o valor dos segmentos dinâmicos será exposto como `this.$route.params` em todos os componentes. Portanto, podemos renderizar o ID do usuário atual, atualizando o template `User` para isso:

``` js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
```

Você pode dar uma olhada em um exemplo aqui: [here](https://jsfiddle.net/yyx990803/4xfa2f19/).

Você pode ter vários segmentos dinâmicos na mesma rota e eles mapearão para campos correspondentes em `$route.params`. Exemplos:

| pattern | matched path | $route.params |
|---------|------|--------|
| /user/:username | /user/evan | `{ username: 'evan' }` |
| /user/:username/post/:post_id | /user/evan/post/123 | `{ username: 'evan', post_id: 123 }` |

Além de `$route.params`, o objeto `$route` também expõe outras informações úteis como `$route.query` (se houver uma consulta na URL), `route.hash`, etc. Você pode verificar os detalhes completos em [API Referência](../api/route-object.md).

### Reagindo às mudanças de params

Uma coisa a observar ao usar rotas com params é que quando o usuário navega de `/user/foo` para `/user/bar`, **a mesma instância do componente será reutilizada**. Como ambas as rotas renderizam o mesmo componente, isso é mais eficiente do que destruir a instância antiga e, em seguida, criar uma nova. **No entanto, isso também significa que os ganchos do ciclo de vida do componente não serão chamados**.

Para reagir à mudanças de params no mesmo componente, você pode simplesmente vigiar o objeto `$route`:

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

Ou, usar o guarda `beforeRouteUpdate` introduzido em  2.2:

``` js
const User = {
  template: '...',
  beforeRouteUpdate (to, from, next) {
    // reage às mudanças da rota...
    // não se esqueça de chamar next()
  }
}
```

### Padrões de correspondência avançados

`vue-router` usa [path-to-regexp](https://github.com/pillarjs/path-to-regexp) como seu mecanismo de correspondência de caminho,
para que ele ofereça suporte a muitos padrões de correspondência avançados, como segmentos dinâmicos opcionais, zero ou mais/um ou mais requisitos e até mesmo padrões de Regex personalizados. Confira a sua [documentação](https://github.com/pillarjs/path-to-regexp#parameters) para esses padrões avançados, e [este exemplo](https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js) usando-os em `vue-router`.

### Prioridade de correspondência

Às vezes, a mesma URL pode ser correspondida por múltiplas rotas. Nesse caso, a prioridade correspondente é determinada pela ordem de definição de rota: quanto mais cedo uma rota for definida, maior será a prioridade.