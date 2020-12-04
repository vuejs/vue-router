# Guardas de Navegação

Como o nome sugere, as guardas de navegação providas pelo `vue-router` são primariamente usadas para guardar navegações seja por redirecionar-las ou cancela-las. Existem um número de maneiras de atrelar ganchos dentro do processo de navegação das rotas: globalmente, por-rota, ou dentro do componente.

Lembra que **mudanças no params ou query não irão acionar uma guarda de navegação para entrada/saida**. Você pode ou [escutar o objeto `$route`](../essentials/dynamic-matching.md#reacting-to-params-changes) para reagir a aquelas mudanças, ou usar a sentinela dentro do componente `beforeRouteUpdate`.

## Guarda para o Before Global

<div class="vueschool"><a href="https://vueschool.io/lessons/how-to-configure-an-authentication-middleware-route-guard-with-vue-router?friend=vuejs" target="_blank" rel="sponsored noopener" title="Aprenda como criar um intermédiado de autenticação com uma guarda de rota global na VueSchool">Aprenda como as guarfas de navgeção funcionam em uma aula gratuita na VueSchool</a></div>

Você pode registar uma guarda global para o before usando `router.beforeEach`:

```js
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  // ...
})
```

A guardas globais do before são chamadas na ordem que foram criadas, sempre que uma navegação for acionada. Guardas podem ser resolvidas assincronamente, e a navegação é considerada **pendente** até que todos os ganchos tenham sidos resolvidos.

Todas as funções de guarda recebem três argumentos que são:

- **`to: Route`**: o alvo para onde objeto Route está a navegar.

- **`from: Route`**: a rota atual de onde o objeto Route está saindo.

- **`next: Function`**: esta função deve ser chamada para **resolver** o gancho. A ação depende dos argumentos atribuidos ao `next`:

  - **`next()`**: vai para o próximo gancho dentro do encadeamento. Se não houver ganchos sobrando, a navegação é **confirmada**.

  - **`next(false)`**: aborta a navegação atual. Se a URL do navegador(browser) foi mudada (seja manualmente pelo usuário ou atráves do botão retroceder), irá ser reconfigurada(reset) para aquela rota do `from`.

  - **`next('/')` or `next({ path: '/' })`**: redireciona para um local diferente. A atual navegação irá ser abortada e uma nova começará. Você pode passar qualquer objeto com uma localização ao `next`, que permitam a você especificar opções como `replace: true`, `name: 'home'` e qualquer opção usando dentro da [propriedade `to` do `router-link`](../../api/#to) ou [`router-push`](../../api/#router-push)

  - **`next(error)`**: (a partir da versão 2.4.0+) se o argumento passado ao `next` é uma instância de `Error`, a navegação será abortada e o erro será passado aos callbacks registados via [`router.onError()`](../../api/#router-onerror).

**Certifique-se de que a função `next` seja executada apenas uma única dentro de todo escopo da guarda de navegação. Ela pode aparecer mais de uma vez, mas somente se o caminhos lógicos não tiverem sobreposição, de outra maneira o gancho nunca será resolvido ou produzirá erros.** Aqui está um exemplo de redirecionamento dos usuários para `/login` se eles não estiverem autenticados:

```js
// Má prática
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  // se o usuário não for autenticado, `next` é chamado duas vezes
  next()
})
```

```js
// Boa prática
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else next()
})
```

## Resolver Guardas Globais

Você pode registar um guarda global com `router.beforeResolve`. Isso é similar ao `router.beforeEach`, com a diferença que as guardas de resolver serão chamadas antes mesmo da navegação ser confirmada, **depois que todas guardas dentro de componentes e componentes de rotas assincronas estiverem resolvidos**.

## Gancho de After Global

Você pode também registar ganchos para o after globalmente, contudo ao contrário das guardas, estes ganchos não recebem a função `next` e não afetão a navegação:

```js
router.afterEach((to, from) => {
  // ...
})
```

## Guarda por Rota

Você pode definir guardas `beforeEnter` diretamente no objeto de configuração de route:

```js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      }
    }
  ]
})
```

Estas guardas têm exatamente a mesma assinatura tais como guardas globais do before.

## Guardas dentro de Componentes

Finalmente, você pode definir diretamente guardas de navegação da rota dentro do componente de rota (aqueles passados para a configuração da rota) com as seguintes opções:

- `beforeRouteEnter`
- `beforeRouteUpdate`
- `beforeRouteLeave`

```js
const Foo = {
  template: `...`,
  beforeRouteEnter (to, from, next) {
    // ativada antes da rota que renderiza este componente for confirmada.
    // não tem acesso ao `this` da instância do componente,
    // porque ela ainda não foi criada no momento em que esta guarda é ativada!
  },
  beforeRouteUpdate (to, from, next) {
    // ativada quando a rota que renderiza este componente estiver para ser mudada.
    // Este componente sendo reusado (pelo uso explicito de `key`) em uma nova rota ou não muda nada.
    // Por exemplo, para uma rota com parametros dinâmicos `/foo/:id`, quando nós
    // navegamos entre `/foo/1` e `/foo/2`, a mesma instância do componente `Foo`
    // será reusada (a menos que você proveja um `key` ao `<router-view>`), e este gancho será ativado quando isso acontecer.
    // tem acesso ao `this` da instância do componente.
  },
  beforeRouteLeave (to, from, next) {
    // ativada quando a rota que renderiza este componente está
    // sendo substituida por outra.
    // tem acesso ao `this` da instância do componente.
  }
}
```

A guarda `beforeRouteEnter` **não** tem acesso ao `this`, porque a guarda é ativada antes que a navegação seja confirmada, assim o novo componente de entrada ainda não foi criado.

Contudo, você pode acessar a instância ao passar um callback ao `next`. O callback será chamado quando a navegação for confirmada, e a instância do componente será passada ao callback como um argumento:

```js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // acessa a instância do componente via `vm`
  })
}
```

Note que `beforeRouteEnter` é o único guarda que suporta a passagem de um callback ao `next`. Para `beforeRouteUpdate` e `beforeRouteLeave`, `this` já se encontra disponível, então a passsagem de um callback é desnecessária e por conseguinte *não é suportada*:

```js
beforeRouteUpdate (to, from, next) {
  // apenas usa o `this`
  this.name = to.params.name
  next()
}
```

O **guarda de saida** é comumente usado para prevenir o usuário de sair acidentalmente da rota com edições não guardadas. A navegação pode ser cancelada pela chamada de `next(false)`.

```js
beforeRouteLeave (to, from, next) {
  const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  if (answer) {
    next()
  } else {
    next(false)
  }
}
```

Se você está usando mixins que adicionam guardas de navegação ao componente, certifique-se de adicionar o mixin **depois da instalação da extensão para o router**:

```js
Vue.use(Router)

Vue.mixin({
  beforeRouteUpdate(to, from ,next) {
    // ...
  }
})
```

## Fluxo Completo de Resolução da Navegação

1. Navegação acionada.
2. Chame a guarda `beforeRouteLeave` dentro de componentes desativados.
3. Chame o guarda global `beforeEach`.
4. Chame pelo guarda `beforeRouteUpdate` dentro de componentes reusados.
5. Chame pelo `beforeEnter` dentro das configurações de rota.
6. Resolva componentes de rota assincronas.
7. Chame pelo `beforeRouteEnter` dentro de componentes ativados.
8. Chame pelo guarda global `beforeResolve`.
9. Navegação confirmada.
10. Chame o ganchos globais `afterEach`.
11. Atualização do DOM acionada.
12. Chame pelos callbacks passados ao `next` dentro do guarda `beforeRouteEnter` com as instâncias instanciadas.
