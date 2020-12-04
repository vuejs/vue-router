# Rotas dinâmicas

<div class="vueschool"><a href="https://vueschool.io/lessons/vue-router-dynamic-routes?friend=vuejs" target="_blank" rel="sponsored noopener" title="Aprenda como casar rotas dinâmicas na Vue School">Aprenda como casar rotas dinâmicas de forma gratuita na Vue School</a></div>

Muitas as vezes nós iremos precisar mapear rotas com o padrão dado no mesmo componente. Por exemplo nós podemos ter um componente `User` que deveria ser renderizado para todos os usuários com diferentes identificadores de usuário, ou com ID. No `vue-router` nós podemos usar uma seção dinâmica no path para alcança-lo:

```js
const User = {
  template: '<div>User</div>'
}

const router = new VueRouter({
  routes: [
    // seção dinâmica começa com dois pontos
    { path: '/user/:id', component: User }
  ]
})
```

Agora URLs como `/user/foo` e `/user/bar` irão ambas se referir a mesma rota.

Uma seção dinâmica é marcada usando se o dois pontos `:`. Quando a rota estiver em uso, o valor da seção dinâmica será exposta como `this.$route.params` em todos os componentes. Portanto, nós podemos renderizar o identificador do usuário atual ao atualizar os templates de `User` para isso:

```js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
```
Você pode verificar no exemplo ao vivo [aqui](https://jsfiddle.net/yyx990803/4xfa2f19/).

Você pode ter várias seções dinâmicas dentro da mesma rota, e eles irão apontar para o campo correspondente no `$route.params`. Exemplos:

| Padrão                       | Caminho correspondente  | \$route.params                         |
| ----------------------------- | ------------------- | -------------------------------------- |
| /user/:username               | /user/evan          | `{ username: 'evan' }`                 |
| /user/:username/post/:post_id | /user/evan/post/123 | `{ username: 'evan', post_id: '123' }` |

Em adição ao `$route.params`, o objeto `$route` também expõe outras informações úteis tais como `$route.query` (se existir uma query na URL), `$route.hash`, etc. Você pode consultar o assunto com mais detalhes na [documentação da API](../../api/#the-route-object).

## Reagindo as mudanças de parâmetros

Algo que se deve prestar atenção quando se está usando routas com parâmetros é que quando o usuário navega de `/user/foo` para `/user/bar`, **a mesma instância do componente será usada novamente**. Uma vez que ambas as rotas renderizam o mesmo componente, isto é mais eficiente do que destruir a instância antiga e depois criar uma nova. **Contudo, isso também significa que os gatilhos do ciclo de vida do componente não serão acionados**.

Para reagir as mudanças de parâmetros dentro do mesmo componente, você pode simplesmente observar o objeto `$route`:

```js
const User = {
  template: '...',
  watch: {
    $route(to, from) {
      // reaga as mundaças de rotas...
    }
  }
}
```
Ou, use a [guarda de navegação](../advanced/navigation-guards.html) `beforeRouteUpdate` introduzidas na versão 2.2:

```js
const User = {
  template: '...',
  beforeRouteUpdate (to, from, next) {
    // reaga as mundaças de rotas...
    // não esqueça executar a função next()
  }
}
```

## Capturar todos / 404 Rota não encontrada

Parametros regulares somente irão corresponder a caracteres entre pedaços de uma url, separadas por `/`. Se nós quisermos corresponder a qualquer coisa, nós podemos usar os asteristicos (`*`):

```js
{
  // irá corresponder a tudo
  path: '*'
}
{
  // irá corresponder a qualquer coisa que comece com `/user-`
  path: '/user-*'
}
```
Quando estiver usando _asteristicos_ em rotas, faça questão de organizar corretamente suas rotas para que o _asteristico_ esteja no final.
A rota `{ path: '*' }` é comumente usada para erros 404 no lado do cliente. Se você está usando o _History mode_, faça questão de também [configurar corretamente o seu servidor](./history-mode.md).

Quando estiver usando _asteristicos_ em rotas, um paramentro chamado `pathMatch` é automaticamente adicionado ao `$route.params`. Ele contém o resto da url capturada pelo _asteristico_:

```js
// Dada uma rota { path: '/user-*' }
this.$router.push('/user-admin')
this.$route.params.pathMatch // 'admin'

// Dada uma rota { path: '*' }
this.$router.push('/non-existing')
this.$route.params.pathMatch // '/non-existing'
```

## Padrões de Captura Avançados

`vue-router` usa o [path-to-regexp](https://github.com/pillarjs/path-to-regexp/tree/v1.7.0) como seu motor de captura de caminho, então ele suporta vários padrôes de captura avançados, tal como a seção dinâmica opcional, zero ou mais / um ou mais requerimentos, e até padrões de regex personalizadas. Consulte por esses padrões avançados em usa [documentação](https://github.com/pillarjs/path-to-regexp/tree/v1.7.0#parameters), e [neste exemplo](https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js) como usa-los com o `vue-router`.

## Prioridade de Captura

Algumas vezes a mesma URL pode ser capturada por multiplas rotas. Em tal cituação a prioridade de captura é determinada pela ordem definida para a rota: quanto mais cedo uma rota é definida, mas alta prioridade ela recebe.
