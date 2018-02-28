# Opções de construção do roteador

### Rotas

- Tipo: `Array<RouteConfig>`

  Tipo de declaração para `RouteConfig`:

  ``` js
  declare type RouteConfig = {
    path: string;
    component?: Component;
    name?: string; // for named routes
    components?: { [name: string]: Component }; // for named views
    redirect?: string | Location | Function;
    props?: boolean | string | Function;
    alias?: string | Array<string>;
    children?: Array<RouteConfig>; // for nested routes
    beforeEnter?: (to: Route, from: Route, next: Function) => void;
    meta?: any;

    // 2.6.0+
    caseSensitive?: boolean; // use case sensitive match? (default: false)
    pathToRegexpOptions?: Object; // path-to-regexp options for compiling regex
  }
  ```

### modo

- type: `string`

- default: `"hash" (in browser) | "abstract" (in Node.js)`

- Valores disponíveis: `"hash" | "history" | "abstract"`

  Configure o modo do roteador.

  - `hash`: use o hash da URL para roteamento. Funciona em todos os browsers suportados pelo Vue, incluindo aqueles que não suportam HTML5 History API.

  - `history`: requer API de histórico HTML5 e configuração do servidor. Confira [Modo de histórico HTML5](../essentials/history-mode.md).

  - `abstract`: funciona em todos os ambientes JavaScript, ex. servidor com Node.js. **O roteador será automaticamente forçado a este modo se nenhuma API do navegador estiver presente.**

### base

- type: `string`

- default: `"/"`

  O URL base do aplicativo. Por exemplo, se todo o aplicativo da página única for exibido em `/app/`, então `base` deve usar o valor `"/app/"`.

### linkActiveClass

- type: `string`

- default: `"router-link-active"`

  Configuração global `<router-link>` classe ativa padrão. Veja também [router-link](router-link.md).

### linkExactActiveClass

> 2.5.0+

- type: `string`

- default: `"router-link-exact-active"`

  Configuração global `<router-link>` classe ativa padrão para correspondências exatas. Veja também [router-link](router-link.md).

### scrollBehavior

- type: `Function`

  Signature:

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

  Para mais detalhes veja [Scroll Behavior](../advanced/scroll-behavior.md).

### parseQuery / stringifyQuery

> 2.4.0+

- type: `Function`

  Fornecer funções de consulta / stringify functions. Substitui o padrão.

### fallback

> 2.6.0+

- type: `boolean`

  Controla se o roteador deve retornar ao modo `hash` quando o navegador não suportar `history.pushState`. Padrões para `true`.

  Definir isso como `false` basicamente faz com que cada `router-link` navegue uma atualização de página completa no IE9. Isso é útil quando o aplicativo é processado pelo servidor e precisa funcionar no IE9, porque um URL de modo hash não funciona com SSR.