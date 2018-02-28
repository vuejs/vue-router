# Navigation Guards

Como o nome sugere, os guardas de navegação fornecidos pelo `vue-router` são usados principalmente para proteger as navegações, redirecionando-o ou cancelando-o. Há várias maneiras de se conectar ao processo de navegação na rota: globalmente, por rota ou componente.

Lembre-se de que **params or query changes won't trigger enter/leave navigation guards**. Você pode [assistir o objeto `$route`](../essentials/dynamic-matching.md#reacting-to-params-changes) para reagir a essas mudanças ou usar a proteção componente no `beforeRouteUpdate`.

### Global Guards

Você pode se registrar globalmente `router.beforeEach`:

``` js
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  // ...
})
```

Global antes que os guardas sejam chamados na ordem de criação, sempre que uma navegação é desencadeada. Os guardas podem ser resolvidos de forma assíncrona, e a navegação é considerada **pendente** antes de todos os ganchos terem sido resolvidos.

Toda função de guarda recebe três argumentos:

- **`to: Route`**: the target [Route Object](../api/route-object.md) being navigated to.

- **`from: Route`**: a rota atual sendo navegada de distância.

- **`next: Function`**: esta função deve ser chamada para **resolver** o gancho. A ação depende dos argumentos fornecidos para `next`:

  - **`next ()`**: avance para o próximo gancho na tubulação. Se não houver ganchos, a navegação é **confirmada**.

  - **`next(false)`**: abort the current navigation. If the browser URL was changed (either manually by the user or via back button), it will be reset to that of the `from` route.

  - **`next (false)`**: aborta a navegação atual. Se o URL do navegador foi alterado (manualmente pelo usuário ou via o botão Voltar), ele será redefinido `from` route/rota.

  - **`next('/')` ou `next({ path: '/' })`**: redirecionar para um local diferente. A navegação atual será abortada e uma nova será iniciada. Você pode passar qualquer objeto de localização para `next`, que permite especificar opções como `replace: true`, `name: 'home'` e qualquer opção usada em [`router-link`'s `to` prop](../api/router-link.md) ou [`router.push`](../api/router-instance.md#methods)

  - **`next(error)`**: (2.4.0+) se o argumento passou para `next` é uma instância de `Error`, ta navegação será interrompida e o erro será passado para callbacks registrados via [`router.onError()`](../api/router-instance.html#methods).

**Certifique-se de sempre chamar a função `next`, caso contrário o gancho nunca será resolvido.**

### Global Resolve Guards

> New in 2.5.0

Em 2.5.0+ você pode registrar uma proteção global com `router.beforeResolve`. Isso é semelhante ao `router.beforeEach`, com a diferença de que os guardas de resolução serão chamados imediatamente antes de a navegação ser confirmada, **depois que todos os guardas no componente e os componentes da rota assíncronos estiverem resolvidos**.

### Global After Hooks

Você também pode se registrar global após ganchos, no entanto, ao contrário dos guardas, esses ganchos não recebem uma função `next` e não podem afetar a navegação:

``` js
router.afterEach((to, from) => {
  // ...
})
```

### Per-Route Guard

Você pode definir guardas `beforeEnter` diretamente no objeto de configuração de uma rota:

``` js
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

Esses guardas têm exatamente a mesma assinatura do que antes dos guardas.

### In-Component Guards

Finalmente, você pode definir diretamente guardas de navegação de rota dentro dos componentes da rota (os passados para a configuração do roteador) com as seguintes opções:

- `beforeRouteEnter`
- `beforeRouteUpdate` (adicionado em 2.2+)
- `beforeRouteLeave`

``` js
const Foo = {
  template: `...`,
  beforeRouteEnter (to, from, next) {
    // called before the route that renders this component is confirmed.
    // does NOT have access to `this` component instance,
    // because it has not been created yet when this guard is called!
  },
  beforeRouteUpdate (to, from, next) {
    // called when the route that renders this component has changed,
    // but this component is reused in the new route.
    // For example, for a route with dynamic params `/foo/:id`, when we
    // navigate between `/foo/1` and `/foo/2`, the same `Foo` component instance
    // will be reused, and this hook will be called when that happens.
    // has access to `this` component instance.
  },
  beforeRouteLeave (to, from, next) {
    // called when the route that renders this component is about to
    // be navigated away from.
    // has access to `this` component instance.
  }
}
```

O guarda `beforeRouteEnter` não **NÃO** tem acesso a `this`, porque o guarda é chamado antes que a navegação seja confirmada, então o novo componente de entrada ainda não foi criado.

No entanto, você pode acessar a instância passando um retorno de chamada para `próximo`. O retorno de chamada será chamado quando a navegação for confirmada e a instância do componente será passada para o retorno de chamada como o argumento:

``` js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // access to component instance via `vm`
  })
}
```

Tenha em atenção que `beforeRouteEnter` é o único guarda que aceita passar uma chamada de retorno para `next`. Para `beforeRouteUpdate` e `beforeRouteLeave`, `this` já está disponível, então passar um retorno de chamada é desnecessário e, portanto, *não suportado*:

```js
beforeRouteUpdate (to, from, next) {
  // just use `this`
  this.name = to.params.name
  next()
}
```

O **leave guard** geralmente é usado para evitar que o usuário abandone acidentalmente a rota com edições não salvas. A navegação pode ser cancelada chamando `next(false)`.

```js
beforeRouteLeave (to, from , next) {
  const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  if (answer) {
    next()
  } else {
    next(false)
  }
}
```

### O Fluxo de Resolução de Navegação Completa

1. Navegação desencadeada. (Navigation triggered)
2. Ligar deixar guardas em componentes desativados. (Call leave guards in deactivated components)
3. Ligue para os guardas globais `beforeEach`. (Call global `beforeEach` guards)
4. Ligue para `beforeRouteUpdate` guardas em componentes reutilizados (2.2+). (Call `beforeRouteUpdate` guards in reused components (2.2+))
5. Ligue para `beforeEnter` nas configurações de rota. (Call `beforeEnter` in route configs)
6. Resolva componentes de rota assíncronos. (Resolve async route components.)
7. Ligue `beforeRouteEnter` nos componentes ativados. (Call `beforeRouteEnter` in activated components)
8. Ligue para guardas globais `beforeResolve` (2.5+). (Call global `beforeResolve` guards (2.5+))
9. Navegação confirmada. (Navigation confirmed)
10. Ligue para ganchos globais `afterEach`. (Call global `afterEach` hooks)
11. Atualizações de DOM desencadeadas. (DOM updates triggered)
12. Chamar reencaminhamentos passados para `próximo` em guardas `beforeRouteEnter` com instâncias instanciadas. (Call callbacks passed to `next` in `beforeRouteEnter` guards with instantiated instances)