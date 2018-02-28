# `<router-link>`

`<router-link>` é o componente para permitir a navegação do usuário em um aplicativo habilitado para roteador. A localização do destino é especificada com o `to` prop. Ele é como uma marca `<a>` com o `href` correto, mas pode ser configurado com o suporte `tag`. Além disso, o link automaticamente recebe uma classe CSS ativa quando a rota de destino está ativa.

`<roteador-link>` é preferido em relação a `<a href="...">` codificado por pelos seguintes motivos:

- Funciona da mesma forma, tanto no modo de histórico HTML5 quanto no modo hash, então, se você decidir mudar o modo, ou quando o roteador volta ao modo hash no IE9, nada precisa ser alterado.

- No modo de histórico HTML5, `router-link` interceptará o evento de clique para que o navegador não tente recarregar a página.

- Quando você está usando a opção `base` no modo de histórico HTML5, você não precisa incluí-lo em URLs do `to` prop.

### Props

- **to**

  - type: `string | Location`

  - required

  Indica a rota de destino do link. Quando clicado, o valor do `to` prop será passado para `router.push ()` internamente, então o valor pode ser uma string ou um objeto descritor de localização.

  ``` html
  <!-- literal string -->
  <router-link to="home">Home</router-link>
  <!-- renders to -->
  <a href="home">Home</a>

  <!-- javascript expression using `v-bind` -->
  <router-link v-bind:to="'home'">Home</router-link>

  <!-- Omitting `v-bind` is fine, just as binding any other prop -->
  <router-link :to="'home'">Home</router-link>

  <!-- same as above -->
  <router-link :to="{ path: 'home' }">Home</router-link>

  <!-- named route -->
  <router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>

  <!-- with query, resulting in `/register?plan=private` -->
  <router-link :to="{ path: 'register', query: { plan: 'private' }}">Register</router-link>
  ```

- **replace**

  - type: `boolean`

  - default: `false`

  A configuração `replace` prop irá chamar `router.replace()` em vez de `router.push ()` quando clicado, então a navegação não deixará um histórico.

  ``` html
  <router-link :to="{ path: '/abc'}" replace></router-link>
  ```

- **append**

  - type: `boolean`

  - default: `false`

  O ajuste `append` prop sempre anexa o caminho relativo ao caminho atual. Por exemplo, assumindo que estamos navegando de `/a` para um link relativo `b`, sem `append` vamos terminar em `/b`, mas com `append` vamos acabar em `/a/b` .

  ``` html
  <router-link :to="{ path: 'relative/path'}" append></router-link>
  ```

- **tag**

  - type: `string`

  - default: `"a"`

  Às vezes, queremos que `<router-link>` seja processado como outra tag, por exemplo, `<li>`. Então, podemos usar `tag` prop para especificar qual tag renderizar, e ainda escutará os eventos de clique para navegação.

  ``` html
  <router-link to="/foo" tag="li">foo</router-link>
  <!-- renders as -->
  <li>foo</li>
  ```

- **active-class**

  - type: `string`

  - default: `"router-link-active"`

  Configure a classe CSS ativa aplicada quando o link está ativo. Observe que o valor padrão também pode ser configurado globalmente através da opção de construtor de roteador `linkActiveClass`.

- **exact**

  - type: `boolean`

  - default: `false`

  O comportamento de correspondência de classe ativa padrão é **inclusive match**. Por exemplo, `<roteador-link para ="/a">` obterá esta classe aplicada enquanto o caminho atual começar com `/a/` ou for `/a`.

  Uma conseqüência disso é que `<roteador-link para ="/">` estará ativo para cada rota! Para forçar o link em "modo de correspondência exata", use o suporte `exato`:

  ``` html
  <!-- this link will only be active at `/` -->
  <router-link to="/" exact>
  ```

  Confira mais exemplos que explicam a classe de link ativo `linkActiveClass` [Veja](https://jsfiddle.net/8xrk1n9f/).

- **event**

  > 2.1.0+

  - type: `string | Array<string>`

  - default: `'click'`

  Especifique os eventos que podem desencadear a navegação do link.

- **exact-active-class**

  > 2.5.0+

  - type: `string`

  - default: `"router-link-exact-active"`

  Configure a classe CSS ativa aplicada quando o link estiver ativo com a correspondência exata. Observe que o valor padrão também pode ser configurado globalmente através da opção do construtor do roteador `linkExactActiveClass`.

### Aplicando `linkExactActiveClass` ao Elemento Externo

Às vezes, podemos querer que a classe ativa seja aplicada a um elemento externo ao invés da própria tag `<a>`, nesse caso, você pode renderizar esse elemento externo usando `<router-link>` e envolver o raw `<a>` dentro da etiqueta:

``` html
<router-link tag="li" to="/foo">
  <a>/foo</a>
</router-link>
```

Nesse caso, o `<a>` será o link real (e obterá o `href` correto), mas a classe ativa será aplicada ao `<li>` externo.