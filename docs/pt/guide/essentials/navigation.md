---
sidebarDepth: 0
---

# Navegação Programada

Além de usar `<router-link>` para criar tags de âncora para uma navegação declarativa, nós podemos fazer isto programaticamente usando os metódos da instância do router.

## `router.push(location, onComplete?, onAbort?)`

**Nota: Dentro da instância Vue, você tem acesso à instância router como `$router`. Você pode então chamar `this.$router.push`.**


Para navegar para uma URL diferente, use `router.push`. Este metódo adiciona uma nova entrada dentro da pilha do history, então quando o usuários clicarem no botão de retroceder do navegador (browser) eles serão levados para URL anterior a atual.

Este é o metódo chamado internamente quando você clicar em um `<router-link>`, então um clique em `<router-link :to="...">` equivale a chamada de `router.push(...)`.

| Declarativa               | Programatica       |
| ------------------------- | ------------------ |
| `<router-link :to="...">` | `router.push(...)` |

O argumento pode ser uma caminho dentro de uma string, ou um objeto descritor de localização. Exemplos:

```js
// um caminho em string literal
router.push('home')

// objeto
router.push({ path: 'home' })

// rota nomeada
router.push({ name: 'user', params: { userId: '123' } })

// com consulta, resultando em /register?plan=private
router.push({ path: 'register', query: { plan: 'private' } })
```
**Nota**: `params` são ignorados se um `path` é provido, que não é o caso para `query`, como mostrado no exemplo acima. Ao invés daquilo, você precisa prover o `name` da rota ou manualmente especificar o `path` completo com qualquer parametro:

```js
const userId = '123'
router.push({ name: 'user', params: { userId } }) // -> /user/123
router.push({ path: `/user/${userId}` }) // -> /user/123
// Isso não irá funcionar
router.push({ path: '/user', params: { userId } }) // -> /user
```

A mesma regra se aplica para a propriedade `to` do componente `router-link`.

A partir da versão 2.2.0+, podesse prover opcionalmente callbacks para `onComplete` e `onAbort` no `router.push` ou no `router.replace` como o segundo e terceiro argumentos. Estes callbacks irão ser chamados quando a ou navegação for completada com sucesso (depois de todas tarefas assincronas serem resolvidas), ou abortada (navegada para a mesma rota, ou para uma rota diferente antes da navegação atual ser terminada), respecivamente.
A partir da versão 3.1.0+, você pode omitir o segundo e o terceiro parametro e `router.push` / `router.replace` irão retornar antes uma promise se Promises forem suportadas.

**Nota:** Se o destino é o mesmo que a rota atual e somente os parametros estão mudando (exemplo: indo de um perfil para o outro `/users/1` -> `/users/2`), você irá ter de usar [`beforeRouteUpdate`](./dynamic-matching.md#reacting-to-params-changes) para reagir as mudanças (exemplo: requesitando a informação do usuário).


## `router.replace(location, onComplete?, onAbort?)`

Ele age parecido com `router.push`, a única diferença é que ele navega sem adicionar uma nova entrada no histórico, como seu nome sugere - ele substitui a entrada atual.

| Declarativa                       | Programatica          |
| --------------------------------- | --------------------- |
| `<router-link :to="..." replace>` | `router.replace(...)` |

## `router.go(n)`

Este metódo recebe um único parametro inteiro que indica quantos passos seguir para frente ou para atrás na pilha do history, similar ao `window.history.go(n)`.

Exemplos:

```js
// siga 1 passo na gravação, o mesmo que history.forward()
router.go(1)

// volte 1 passo na gravação, o mesmo que history.back()
router.go(-1)

// siga 3 passos na gravação
router.go(3)

// falha silenciosamente se não existirem tantas gravações
router.go(-100)
router.go(100)
```

## Manipulação do History

Você poder notado que `router.push`, `router.replace` e `router.go` são semelhantes a [`window.history.pushState`, `window.history.replaceState` e `window.history.go`](https://developer.mozilla.org/en-US/docs/Web/API/History) e o que eles fazem é imitar as APIs de `window.history`.

Logo, se você já estiver familiarizado com as [APIs do History do Navegador(Browser)](https://developer.mozilla.org/en-US/docs/Web/API/History_API), manipular o history será super fácil com o Vue Router.

É digno de mençaõ que os metódos de navegação do Vue Router (`push`, `replace`, `go`) funcionam consistentimente em todos os modos de rotas (`history`, `hash`, `abstract`).
