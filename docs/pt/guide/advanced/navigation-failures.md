# Falhas de Navegação

> A partir da versão 3.4.0

Quando usar `router-link`, o Vue Router chama `router.push` para acionar a navegação. Enquanto o comportamento esperado de a maioria dos links é navegar até uma nova página, existem algumas poucas situações onde os usuários permanecem na mesma página:

- Quando os usuários já estão na página em que eles estão tentando ir
- Quando uma [guarda de navegação](./navigation-guards.md) aborta a navegação ao invocar `next(false)`
- Quando uma [guarda de navegação](./navigation-guards.md) lança uma exceção ou invoca `next(new Error)`


Quando estiver usando o componente `router-link`, **nenhuma dessas falhas irá registar um erro**. Conteudo, se você está usando `router.push` ou `router.replace`, você pode vir a cruzar-se com a messagem _"Uncaught (in promise) Error"_ seguida de uma messagem mais especifica em seu console. Vamos entender como diferenciar _Falhas de Navegação_.

::: tip Debaixo dos panos
Na versão 3.2.0, _Falhas de Navegação_ eram exposta através de dois eventos de callbacks opcionais de `router.push`: `onComplete` e `onAbort`. Desde a versão 3.1.0, `router.push` e `router.replace` retornam uma _Promise_ se o callback para `onComplete`/`onAbort` não fosse provido. Essa _Promise_ resolve invocando `onComplete` e rejeita invocando `onAbort`.
:::

## Restreando Falhas de Navegação

_Falhas de Navegação_ são instâncias de `Error` com algumas propriedades extras. Para verificar se um erro vem do Router, use a função `isNavigationFailure`:

```js
import VueRouter from 'vue-router'
const { isNavigationFailure, NavigationFailureType } = VueRouter

// tentando acessar a página do administrador
router.push('/admin').catch(failure => {
  if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
    // mostrar uma notificação resumida ao usuário
    showToast('Login in order to access the admin panel')
  }
})
```

::: tip
Se você omitir o segundo parametro: `isNavigationFailure(failure)`, irá somente verificar se o erro é uma _Falha de Navegação_.
:::

## `NavigationFailureType`

`NavigationFailureType` ajuda os desenvolvedores a perceber as diferenças existentes entre os vários tipos de _Falhas de Navegação_. Existem quatro tipos diferentes:

- `redirected`: `next(newLocation)` é chamado dentro da guarda de navegação para redirecionar para algum lugar determinado.
- `aborted`: `next(false)` é chamado dentro da guarda de navegação para a navegação.
- `cancelled`: Uma nova navegação tomou completamente o lugar antes da navegação atual poder terminar. exemplo: `router.push` é chamado enquanto aguarda dentro da guarda de navegação.
- `duplicated`: A navegação foi previnida porque nós já estamos local alvo.

## Propriedades da _Falhas de Navegação_

Todos as falhas de navegação expõem as propriedades `to` e `from` para refletir o local atual como também o local de destino para a navegação que falhou:

```js
// tentando acessar a página do administrador
router.push('/admin').catch(failure => {
  if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
    failure.to.path // '/admin'
    failure.from.path // '/'
  }
})
```

Em todos os casos, `to` e `from` são locais de rotas normalizados.
