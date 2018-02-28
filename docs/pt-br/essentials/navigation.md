# Navegação Programática

Além de usar `<router-link>` para criar tags de âncora para navegação declarativa, podemos fazer isso de forma programática usando os métodos de instância do roteador.

#### `router.push(location, onComplete?, onAbort?)`

**Nota: Dentro de uma instância do Vue, você tem acesso à instância do roteador como `$router`. Você pode, portanto, chamar `this.$router.push`.**

Para navegar para um URL diferente, use `router.push`. Este método empurra uma nova entrada na pilha de histórico, então, quando o usuário clicar no botão de volta do navegador, eles serão levados para o URL anterior.

This is the method called internally when you click a `<router-link>`, so clicking `<router-link :to="...">` is the equivalent of calling `router.push(...)`.

Este é o método chamado internamente quando você clica em `<router-link>`, então, clicando em `<router-link :to="...">` é o equivalente a chamar `router.push(...)`.

| Declarative | Programmatic |
|-------------|--------------|
| `<router-link :to="...">` | `router.push(...)` |

O argumento pode ser um caminho de cadeia ou um objeto descritor de localização. Exemplos:

``` js
// literal string path
router.push('home')

// object
router.push({ path: 'home' })

// named route
router.push({ name: 'user', params: { userId: 123 }})

// with query, resulting in /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})
```

**Nota**: `params` são ignorados se um `path` for fornecido, o que não é o caso para `query`, como mostrado no exemplo acima. Em vez disso, você precisa fornecer o `name` da rota ou especificar manualmente todo o `path` com qualquer parâmetro:

```js
const userId = 123
router.push({ name: 'user', params: { userId }}) // -> /user/123
router.push({ path: `/user/${userId}` }) // -> /user/123
// This will NOT work
router.push({ path: '/user', params: { userId }}) // -> /user
```

As mesmas regras aplicam-se para a propriedade `to` do componente `router-link`.

In 2.2.0+, optionally provide `onComplete` and `onAbort` callbacks to `router.push` or `router.replace` as the 2nd and 3rd arguments. These callbacks will be called when the navigation either successfully completed (after all async hooks are resolved), or aborted (navigated to the same route, or to a different route before current navigation has finished), respectively.

Em 2.2.0+, forneça opcionalmente encaminhamentos de chamada `onComplete` e `onAbort` para `router.push` ou `router.replace` como os argumentos 2 e 3. Esses callbacks serão chamados quando a navegação seja concluída com êxito (depois de todos os ganchos assíncronos serem resolvidos) ou abortados (navegaram para a mesma rota ou para uma rota diferente antes da navegação atual ter terminado), respectivamente.

**Nota:** Se o destino for o mesmo que a rota atual e apenas os params estão mudando (p. ex, indo de um perfil para outro `/users/1` -> `/users/2`), você terá que usar [`beforeRouteUpdate`](./dynamic-matching.html#reacting-to-params-changes) para reagir às mudanças (p. ex. buscar as informações do usuário).

#### `router.replace(location, onComplete?, onAbort?)`

Isso funciona como `router.push`, a única diferença é que ele navega sem pressionar uma nova entrada de histórico, como o nome sugere - ele substitui a entrada atual.

| Declarative | Programmatic |
|-------------|--------------|
| `<router-link :to="..." replace>` | `router.replace(...)` |

#### `router.go(n)`

Este método leva um único inteiro como parâmetro que indica por quantas etapas para avançar ou retroceder na pilha do histórico, semelhante a `window.history.go(n)`.

Exemplos

``` js
// go forward by one record, the same as history.forward()
router.go(1)

// go back by one record, the same as history.back()
router.go(-1)

// go forward by 3 records
router.go(3)

// fails silently if there aren't that many records.
router.go(-100)
router.go(100)
```

#### Manipulação de História

Você pode ter notado que `router.push`, `router.replace` e `router.go` são contrapartes de [`window.history.pushState`, `window.history.replaceState` e `window.history.go`](https://developer.mozilla.org/en-US/docs/Web/API/History), imitam a API `window.history`.

Portanto, se você já está familiarizado com  [APIs do Histórico do Navegador](https://developer.mozilla.org/en-US/docs/Web/API/History_API), manipular o histórico será super fácil com vue-router.

Vale ressaltar que os métodos de navegação vue-router (`push`, `replace`, `go`) funcionam consistentemente em todos os modos do roteador (`history`, `hash` e `abstract`).