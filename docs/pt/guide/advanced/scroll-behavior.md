# Comportamento de rolagem

<div class="vueschool"><a href="https://vueschool.io/lessons/how-to-control-the-scroll-behavior-of-vue-router?friend=vuejs" target="_blank" rel="sponsored noopener" title="Aprenda a controlar o comportamento de rolagem na VueSchool">Aprenda a controlar o comportamento de rolagem em uma aula gratuita na Vue School</a></div>

Quando estivermos usando roteamento no lado do cliente, nós podemos rolar para o topo quando navegamos para uma nova rota, ou preservar a posição de rolagem do histórico de entradas apenas como um recarregamento real de página faz. `vue-router` permite você alcançar esses ou ainda melhor, permite você personalizar completamente o comportamento de rolagem na rota de navegação.

**Note: está funcionalidade apenas funciona se o navegador(broweser) suportar `history.pushState`.**

Quando estiver criando a instância de router, você pode prover a função `scrollBehavior`:

``` js
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // retorna a posição desejada
  }
})
```

A função `scrollBehavior` recebe os objetos de rota `to` e `from`. O terceiro argumento, `savedPosition`, está apenas disponível se este é uma navegação `popstate` (acionada pelos botões de retroceder/avançar do navegador(browser)).

A função pode retornar um objeto de posição de rolagem. O objeto poderia estar na forma de:

- `{ x: number, y: number }`
- `{ selector: string, offset?: { x: number, y: number } }` (o offset(desvio) somente é suportado a partir da versão 2.6.0+)

Se um valor falsy ou objeto vazio é retornado, nenhuma rolagem irá acontecer.

Por exemplo:

``` js
scrollBehavior (to, from, savedPosition) {
  return { x: 0, y: 0 }
}
```

Isto irá simplesmente fazer a página rolar até ao topo em todas as navegações da rota.

Retornar o `savedPosition` irá resultar em um comportamento semelhate ao nativo quando se estiver navegando usando os botões de retroceder/avançar:

``` js
scrollBehavior (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}
```

Se você quiser simular o comportamento "rolar para a ancora":

``` js
scrollBehavior (to, from, savedPosition) {
  if (to.hash) {
    return {
      selector: to.hash
      // , offset: { x: 0, y: 10 }
    }
  }
}
```

Nós podemos também usar os [campos meta da rota](meta.md) para implementar controlo do comportamento de rolagem bem mais trabalhado. Consulte um exemplo completo [aqui](https://github.com/vuejs/vue-router/blob/dev/examples/scroll-behavior/app.js).

## Rolagem Assincrona

> Novo a partir da versão 2.8.0

Você pode também retornar uma Promise que resolve para o descritor da posição desejada:

``` js
scrollBehavior (to, from, savedPosition) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ x: 0, y: 0 })
    }, 500)
  })
}
```

É possível atrelar um gancho que será acionado com os eventos que partem do componente de transição do nível da página para fazer o comportamento de rolagem executar amigavelmente com as transições da sua página, mas devido a possibilidade de variabilidade e complexidade em casos de uso, nós simplesmente provemos esta forma primitiva para abilitar implementações especificas no terreno do usuário.

## Rolagem Suave

Você pode abilitar a rolagem suave nativa para os [navegadores(browsers) que o suportam](https://developer.mozilla.org/en-US/docs/Web/API/ScrollToOptions/behavior) pela simples adição da opção `behavior` ao objeto retornado dentro de `scrollBehavior`:

```js
scrollBehavior (to, from, savedPosition) {
  if (to.hash) {
    return {
      selector: to.hash
      behavior: 'smooth',
    }
  }
}
```
