---
sidebar: auto
---

# Referência da API

## `<router-link>`

`<router-link>` é um componente que dá a possibilidade ao usuário de navegar em uma aplicação com a funcionalidade de rotas ativada. O local de destino é especificado atráves da propriedade `to`. Ela renderiza como uma tag `<a>` com o `href` corrento por padrão, mas pode ser configurada usando a propriedade `tag`. Em adição, o link automaticamente recebe um classe css active quando o destino da rota estiver ativo.

É preferível usar `<router-link>` em detrimento do `<a href="...">` pelas seguintes razões:

- Ele funciona da mesma maneira em ambos os modos history do HTML5 e hash, mesmo se você até decidir mudar de modo, or quando a rota resolver voltar para o modo hash dentro do IE9, nada precisa ser mudado.
- No modo history do HTML5, `router-link` interceptará o evento de clique então o navegador(browser) não tentará recarregar a página.
- Quando você estiver usando a opção `base` no modo history do HTML5, você não precisa inclui-lo na `to` da propriedade das URLs.

### `v-slot` API (a partir da versão 3.1.0+)

O `router-link` expõe uma personalização de baixo nível através de um [slot escopado](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots). Isto é uma API mais avançada que primeiramente tem como alvo autores de bibliotecas mas que podem vir a ser úteis para desenvolvedores também, na maioria das vezes em componente personalizado um _NavLink_ ou outro.

**Quando estiver usando a API `v-slot`, é fundamental passar um único filho ao `router-link`**. Se você não o fizer, `router-link` irá envolver seus filhos em um elemento `span`.

```html
<router-link
  to="/about"
  v-slot="{ href, route, navigate, isActive, isExactActive }"
>
  <NavLink :active="isActive" :href="href" @click="navigate"
    >{{ route.fullPath }}</NavLink
  >
</router-link>
```

- `href`: url resolvida. Este seria o atributo `href` de um elemento `a`
- `route`: localização normalizada resolvida
- `navegate`: função para acionar a navegação. **Isso irá automaticamente prevenir eventos quando for necessário**, do mesmo jeito que `router-link` faz
- `isActive`: `true` se a [classe active](#active-class) deve ser applicada. Permite aplicar uma classe arbitrária
- `isExactActive`: `true` se a [classe exact active](#exact-active-class) deve ser aplicada. Permite aplicar uma classe arbitrária


#### Exemplo: Aplicando a classe active ao elemento externo

Algumas vezes nós podemos querer que a classe active seja aplicada ao elemento externo ao invés da própria tag `<a>`, neste caso, você pode envolver aquele elemento dentro de um `router-link` e usar a propriedade `v-slot` para criar o seu link:

```html
<router-link
  to="/foo"
  v-slot="{ href, route, navigate, isActive, isExactActive }"
>
  <li
    :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active']"
  >
    <a :href="href" @click="navigate">{{ route.fullPath }}</a>
  </li>
</router-link>
```

:::tip
Se você adicionar um `target="_blank"` ao seu elemento `a`, você deve omitir o manipulador `@click="navigate"`.
:::

## Propriedades de `<router-link>`

### to

- tipo: `string | destino`
- obrigatório

  Determina a rota de destino do link. Quando clicado, o valor da propriedade to será internamente passada ao `router.push()`, então o valor pode ser ou uma string ou um objeto descritor de destino.

  ```html
  <!-- string literal -->
  <router-link to="home">Home</router-link>
  <!-- renderiza para -->
  <a href="home">Home</a>

  <!-- expressão javascript usando `v-bind` -->
  <router-link v-bind:to="'home'">Home</router-link>

  <!-- omitir `v-bind` está bem, assim como vincular outra propriedade qualquer -->
  <router-link :to="'home'">Home</router-link>

  <!-- o mesmo que o de cima -->
  <router-link :to="{ path: 'home' }">Home</router-link>

  <!-- rota nomeada -->
  <router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>

  <!-- com consulta, resultando em `/register?plan=private` -->
  <router-link :to="{ path: 'register', query: { plan: 'private' }}"
    >Register</router-link
  >
  ```

### replace

- tipo: `booleano`
- valor padrão: `false`

  Configura a propriedade `replace` que irá chamar `router.replace()` ao invés de `router.push()` quando clicado, assim a navegação não irá deixar gravação de histórico.

  ```html
  <router-link :to="{ path: '/abc'}" replace></router-link>
  ```

### append

- tipo: `boolean`
- valor padrão: `false`

  Configura da propriedade `append` que sempre anexa o caminho relativo ao o caminho atual. Por exemplo, vamos assumir que nós estámos navegando de `/a` para um link relativo `b`, sem o `append` nós iremos terminar em `/b`, mas com `append` nós iremos terminar em `/a/b`.

  ```html
  <router-link :to="{ path: 'relative/path'}" append></router-link>
  ```

### tag

- tipo: `string`
- valor padrão: `"a"`

  Algumas vezes nós quereremos que `<router-link>` renderize como uma outra tag diferente, por exemplo `<li>`. Logo nós podemos usar a propriedade `tag` para especificar para qual renderizar, e ela irá continuar a responder ao evento de clique para a navegação.

  ```html
  <router-link to="/foo" tag="li">foo</router-link>
  <!-- renderiza como -->
  <li>foo</li>
  ```


### active-class

- tipo: `string`
- valor padrão: `"router-link-active"`

  Configura a classe CSS active que é aplicada quando o link está ativo. Note que o valor padrão pode ser também globalmente configurado através da opção `linkActiveClass` do construtor de router.

### exact

- tipo: `boolean`
- default: `false`

  O comportamento de captura da classe active padrão é **captura inclusiva**. Por exemplo, `<router-link to="/a">` irá ter essa classe aplicada contanto que o caminho atual comece com `/a/` ou é `/a`.

  Uma consequência disso é que `<router-link to="/">` será ativa para todas rotas! Para forçar o link dentro do "modo de captura exata", usa a propriedade `exact`:

  ```html
  <!-- Este link só será ativo em at `/` -->
  <router-link to="/" exact></router-link>
  ```

  Consulte mais exemplos explicando a classe de link ativo [ao vivo](https://jsfiddle.net/8xrk1n9f/).

### event

- tipo: `string | Array<string>`
- valor padrão: `'click'`

  Especifica os eventos que podem ser acionados no link de navegação.

### exact-active-class

- tipo: `string`
- valor padrão: `"router-link-exact-active"`

  Configura a classe CSS active aplicada quando o link é ativo com a captura exata. Note que o valor padrão também pode ser configurado globalmente na opção `linkExactActiveClass` do construtor do router.

### aria-current-value

- tipo: `'page' | 'step' | 'location' | 'date' | 'time'`
- valor padrão: `'page'`

  Configura o valor de `aria-current` quando o link é ativo com a captura exata. Deve ser um dos [valores permitidos para aria-current](https://www.w3.org/TR/wai-aria-1.2/#aria-current) na especificação de ARIA. Na maioria dos casos, o valor padrão `page` deve ser a melhor escolha.

## `<router-view>`

O componente `<router-view>` é um componente funcional que renderiza o componente que corresponde ao caminho passado. Componentes renderizados em `<router-view>` também podem conter seus próprios `<router-view>`, que renderizarão componentes para caminhos aninhados.

Quaisquer propriedades sem nome serão passadas através do componente renderizado, contudo muitas das vezes os dados para rotas são contidas dentro dos parametros da rota.

Desde seja apenas um componente, funciona com `<transition>` e `<keep-alive>`. Quando usa-los juntos, certifique-se de usar `<keep-alive>` por dentro:

```html
<transition>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</transition>
```

## Propriedades do `<router-view>`

### name

- tipo: `string`
- valor padrão: `"default"`

  Quando um `<router-view>` tem um nome, ele irá renderizar o componente com o nome correspondente na opção `components` do dado de captura de rota. Consulte por [View Nomeadas](../guide/essentials/named-views.md) para ter um exemplo.

## Opções do Construtor Router

### routes

- tipo: `Array<RouteConfig>`

  Declaração de tipo para `RouteConfig`:

  ```ts
  interface RouteConfig = {
    path: string,
    component?: Component,
    name?: string, // para rotas nomedas
    components?: { [name: string]: Component }, // para views nomedas
    redirect?: string | Location | Function,
    props?: boolean | Object | Function,
    alias?: string | Array<string>,
    children?: Array<RouteConfig>, // para rotas aninhadas
    beforeEnter?: (to: Route, from: Route, next: Function) => void,
    meta?: any,

    // A partir da versão 2.6.0+
    caseSensitive?: boolean, // usa a captura com sensibilidade de caixa? (default: false)
    pathToRegexpOptions?: Object // opção caminho-para-expressão regular para compilar expressões regulares
  }
  ```

### mode

- tipo: `string`

- valor padrão: `"hash" (no browser) | "abstract" (no Node.js)`

- valores disponíveis: `"hash" | "history" | "abstract"`

  Configura o modo de roteamento.

  - `hash`: usa a URL com hash (#) para roteamento. Funciona em todos os browsers que suportados pelo Vue, incluindo aqueles que não suportam a API History da HTML5.

  - `history`: requer a API History da HTML5 e configuração de servidor. Consulte [Modo History da HTML5](../guide/essentials/history-mode.md).

  - `abstract`: funciona em todos ambientes JavaScript, por exemplo no lado do servidor com Node.js. **O router irá automaticamente ser forçado neste modo se nenhuma API do browser se fizer presente.**


### base

- tipo: `string`

- valor padrão: `"/"`

  A URL de base da aplicação. Por exemplo, se toda a aplicação de única página estiver sendo servida debaixo de `/app/`, então o `base` deveria usar o valor `"/app/"`.

### linkActiveClass

- tipo: `string`

- valor padrão: `"router-link-active"`

  Configura globalmente a classe ativa padrão do `<router-link>`. Veja também [router-link](#router-link).

### linkExactActiveClass

- tipo: `string`

- valor padrão: `"router-link-exact-active"`

  Configura globalmente a classe padrão ativa para elemento `<router-link>` ativo exato. Veja também [router-link](#route-link).

### scrollBehavior

- tipo: `Function`

  Assinatura:

  ```
  type PositionDescriptor =
    { x: number, y: number } |
    { selector: string } |
    ?{}

  type scrollBehaviorHandler = (
    to: Route,
    from: Route,
    savedPosition?: { x: number, y: number }
  ) => PositionDescriptor | Promise<PositionDescriptor>
  ```

  Para mais detalhes veja [scrollBehavior](../guide/advanced/scroll-behavior.md).

### parseQuery / stringifyQuery

- tipo: `Function`

  Provê uma analize personalizada de um string de consulta / funções de stringify. Sobrescreve o padrão.

### fallback

- tipo: `boolean`

- valor padrão: `true`

  Verifica se o router deveria voltar ao modo `hash` quando o browser não oferece suporte ao `histoy.pushState` porém o modo está configurado como `history`.

  Configurar este para `false` essencialmente faz com que todas navegações de `router-link` façam um recarregamento de toda página no IE9. Isso é útil quando a aplicação é renderizada a partir do servidor e precisa funcionar no IE9, porque uma URL no modo hash não funciona com SSR.

## Propriedades da Instância do Router

### router.app

- tipo: `Vue instance`

  A raiz da instância Vue onde `router` foi injetado como dependência.

### router.mode

- tipo: `string`

  O [modo](./#mode) que o router está usando.

### router.currentRoute

- tipo: `Route`

  A rota atual representada como um [objeto Route](#the-route-object).

## Metódos da Instância Router

### router.beforeEach

### router.beforeResolve

### router.afterEach


Assinaturas:

```js
router.beforeEach((to, from, next) => {
  /* must call `next` */
})

router.beforeResolve((to, from, next) => {
  /* must call `next` */
})

router.afterEach((to, from) => {})
```

Adiciona guardas de navegação globais. Veja [Guardas de Navegação](../guide/advanced/navigation-guards.md) para mais detalhes.

Todos os três metodos retornam uma função que remove a guarda/ganho registada.

### router.push

### router.replace

### router.go

### router.back

### router.forward

Assinaturas:

```js
router.push(location, onComplete?, onAbort?)
router.push(location).then(onComplete).catch(onAbort)
router.replace(location, onComplete?, onAbort?)
router.replace(location).then(onComplete).catch(onAbort)
router.go(n)
router.back()
router.forward()
```

Navega programaticamente para uma nova URL. Consulte [Navegação Programática](../guide/essentials/navigation.md) para mais detalhes.

Essas funções só podem ser chamadas depois da instalação da extensão Router e passando ele para a raiz da instância Vue como mostrado no [dando inicío](../guide/README.md).

### router.getMatchedComponents

```js
const matchedComponents: Array<Component> = router.getMatchedComponents(location?)
```

Returna um Array de componentes (definição/construtor, não instâncias) que correspondente ao local ou rota atual. Isso é muito usado durante a renderização no lado do servidor para performar a pre-requesição de dados.

### router.resolve

Assinaturas:

```js
const resolved: {
  location: Location;
  route: Route;
  href: string;
} = router.resolve(location, current?, append?)
```

Resolve de forma reversa a URL. Fornece o local na mesma forma que é usada em `<router-link/>`.

- `current` é a rota atual por padrão (na maioria das vezes você não precisa modifica-lo)
- `àppend` permite que você anexe o caminho a rota `current` (como com [`router-link`](#router-link-props))

### router.addRoutes

Assinaturas:

```js
router.addRoutes(routes: Array<RouteConfig>)
```

Adiciona dinamicamente mais rotas ao router. O argumento deve ser um Array usando o mesmo formato de configuração de rota com a opção construtora `routes`.

### router.onReady

Assinaturas:

```js
router.onReady(callback, [errorCallback])
```

Este metódo agenta um callback a ser cahamdo quando o router tiver completado a navegação inicial, o que significa que ele tem como resolvidas todos os ganchos de entradas e componentes assincronos que estão associados a rota inicial.

Isso é útil na renderização do lado do servidor para assegurar uma saída consistente em ambos, o servidor e o cliente.

O segundo argumento `errorCallback` é apenas suportado a partir da versão 2.4+. Será chamado quando ocorrer um erro na resolução da rota inicial (por exemplo: quando falhar em resolver um componente assincro).

### router.onError

Assinatura:

```js
router.onError(callback)
```

Regista um callback que será chamado quando um erro ocorrer durante uma navegação de rota. Note que para um erro ser chamado, deve ser em um dos seguintes senários:

- O erro é lançado sincronamente dentro de uma função de guarda de rota;

- O erro é capturado e assincronamente manipulado pela chamada de `next(error)` dentro de uma função de guarda de rota;

- Um erro ocorrido quando se tenta resolver um componente assincrono que é necessário para renderizar uma rota.

## O objeto Route

Um **objeto route** representa o estado da rota ativa atual. Ele contém informações analizidas da URL atual e a **rota gravada** capturada pela URL.

O objeto de rota é imutável. Toda navegação bem-sucessida resultará em um novo objeto de rota.

O objeto de rota pode ser encontrado em vários lugares:

- Dentro do componentes como `this.$route`
- Dentro do observador de callbacks do `$route`
- Como o valor retornado pela chamada de `router.match(location)`
- Dentro de guardas de navegação como os dois primeiros argumentos:

  ```js
  router.beforeEach((to, from, next) => {
    // `to` e `from` são ambos objetos de rota
  })
  ```

- Dentro da função `scrollBehavior` como os dois primeiros argumentos:

  ```js
  const router = new VueRouter({
    scrollBehavior(to, from, savedPosition) {
      // `to` e `from` são ambos objetos de rota
    }
  })
  ```

### Propriedades do Objeto Route

- **\$route.path**

  - tipo: `string`

    Um string que é igual ao caminho da rota atual, sempre resolvido como um caminho absoluto. Exemplo: `"/foo/bar"`.

- **\$route.params**

  - tipo: `Object`

    Um objeto que contém pares chave/valor de segmentos dinâmicos e segmentos estrela. Se não existirem parametros o valor será um objeto vázio.

- **\$route.query**

  - tipo: `Object`

    Um objeto que contém pares chave/valor da string de consulta. Por exemplo, para um caminho `/foo?user=1`, nós receberemos `$route.query.user == 1`. Se não existir consulta o valor será um objeto vázio.

- **\$route.hash**

  - tipo: `string`

    A hash da rota atual (com o `#`), se houver uma. Se nenhuma hash é apresentado o valor será uma string vázia.

- **\$route.fullPath**

  - tipo: `string`

    A URL completa resolvida incluindo a consulta e a hash.

- **\$route.matched**

  - tipo: `Array<RouteRecord>`

    Um Array contendo **route gravadas** para todos segmentos de caminhos aninhados da rota atual. Rota gravadas são as copias dos objetos no Array de configuração de `routes` (e em Arrays de `children`):

    ```js
    const router = new VueRouter({
      routes: [
        // o objeto a seguir é uma rota gravada
        {
          path: '/foo',
          component: Foo,
          children: [
            // isto também é uma rota gravada
            { path: 'bar', component: Bar }
          ]
        }
      ]
    })
  ```

  Quando a URL é `/foo/bar`, `$route.matched` será um Array contendo ambos objetos (clonado), na ordem de pai para filho.

- **\$route.name**

  O nome da rota atual, se houver uma. (Veja [Rotas Nomedas](../guide/essentials/named-routes.md))

- **\$route.redirectedFrom**

  O nome da rota de onde foi redirecionada, se existiu uma. (Veja [Redirecionamento e Apelidos](../guide/essentials/redirect-and-alias.md))

## Injeções de Componentes

### Propriedades do Componente Injetado

Essas propriedades são injetadas dentro de todo componente filho ao passar a instância de router para a instância raiz como a opção `router`.

- **this.\$route**

  A instância de router.

- **this.\$route**

  A atual [Rota](#the-route-object) ativa. Está propriedade é de somente leitura e suas propriedades são imutáveis, mas pode ser observadas.

### Opções Habilita do Componentes

- **beforeRouteEnter**
- **beforeRouteUpdate**
- **beforeRouteLeave**

  Veja [Guardas dentro de Componentes](../guide/advanced/navigation-guards.md#in-component-guards).
