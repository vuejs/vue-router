# Scroll Behavior

Ao usar o roteamento do lado do cliente, podemos querer rolar para cima ao navegar para uma nova rota ou preservar a posição de rolagem das entradas do histórico, assim como o recarregamento de página real. `vue-router` permite que você obtenha isso e ainda melhor, permite que você personalize completamente o comportamento de rolagem na navegação de rota.

** Nota: este recurso só funciona se o navegador suportar `history.pushState`.**

Ao criar uma instância do roteador, você pode fornecer a função `scrollBehavior`:

``` js
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // return desired position
  }
})
```

A função `scrollBehavior` recebe os objetos de rota `to` e `from`. O terceiro argumento, `savedPosition`, só está disponível se esta for uma navegação `popstate` (desencadeada pelos botões de volta/para a frente do navegador).

A função pode retornar um objeto de posição de rolagem. O objeto poderia estar na forma de:

- `{ x: number, y: number }`
- `{ selector: string, offset? : { x: number, y: number }}` (suportado apenas em 2.6.0+)

Se um valor falso ou um objeto vazio for retornado, nenhuma rolagem acontecerá.

Por exemplo:

``` js
scrollBehavior (to, from, savedPosition) {
  return { x: 0, y: 0 }
}
```

Isso simplesmente fará com que a página se deslize para o topo para toda a navegação de rotas.

Retornar o `savedPosition` resultará em um comportamento nativo ao navegar com os botões de volta/para a frente:

``` js
scrollBehavior (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}
```

Se você quiser simular o comportamento "scroll to anchor":

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

Nós também podemos usar [route meta fields](meta.md) para implementar o controle de comportamento de rolagem fino. Confira um exemplo completo  [aqui](https://github.com/vuejs/vue-router/blob/dev/examples/scroll-behavior/app.js).

### Scroll assíncrono

> Novo em 2.8.0

Você também pode retornar uma promessa que resolve o descritor de posição desejado:

``` js
scrollBehavior (to, from, savedPosition) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ x: 0, y: 0 })
    }, 500)
  })
}
```

É possível conectar isso com eventos de um componente de transição de nível de página para que o comportamento de rolagem seja bem sucedido com as transições de página, mas, devido à possível variação e complexidade em casos de uso, simplesmente fornecemos esse primitivo para habilitar implementações específicas de usuários.