# Opciones del constructor de Router

### routes

- tipo: `Array<RouteConfig>`

  Declaración de tipos para `RouteConfig`:

  ``` js
  declare type RouteConfig = {
    path: string;
    component?: Component;
    name?: string; // para rutas con nombre
    components?: { [name: string]: Component }; // para vistas con nombre
    redirect?: string | Location | Function;
    props?: boolean | string | Function;
    alias?: string | Array<string>;
    children?: Array<RouteConfig>; // para sub-rutas
    beforeEnter?: (to: Route, from: Route, next: Function) => void;
    meta?: any;

    // 2.6.0+
    caseSensitive?: boolean; // utilizar o no matcheo case sensitive (valor por defecto: false)
    pathToRegexpOptions?: Object; // Opciones path-to-regexp para compilar expresiones regulares
  }
  ```

### mode

- tipo: `string`

- valor por defecto: `"hash" (en navegadores) | "abstract" (en Node.js)`

- valores disponibles: `"hash" | "history" | "abstract"`

  Configura el modo del `router`.

  - `hash`: utiliza el _hash_ en la URL para el enrutamiento. Funciona en todos los navegadores que soportan Vue, incluidos aquellos que no soportan la API de historial de HTML5 .

  - `history`: requiere la API de historial de HTML y configuración del lado servidor. [Modo historial HTML5](../essentials/history-mode.md).

  - `abstract`: funciona en todos los ambientes de JavaScript, por ejemplo, del lado servidor con Node.js. **Se forzará este modo de trabajo en el router si no se detecta la API de navegador.**

### base

- tipo: `string`

- valor por defecto: `"/"`

  La URL base para la aplicación. Por ejemplo, si toda la aplicación se encuentra dentro de `/app/`, entonces `base` debería llevar ese valor.

### linkActiveClass

- tipo: `string`

- valor por defecto: `"router-link-active"`

  Configura globalmente la clase activa por defecto de `<router-link>`. Más información en [router-link](router-link.md).

### linkExactActiveClass

> 2.5.0+

- tipo: `string`

- valor por defecto: `"router-link-exact-active"`

  Configura globalmente la clase activa de `<router-link>` para coincidencias de rutas exactas. Más información en [router-link](router-link.md).

### scrollBehavior

- tipo: `Function`

  Firma:

  ```
  (
    to: Route,
    from: Route,
    savedPosition?: { x: number, y: number }
  ) => { x: number, y: number } | { selector: string } | ?{}
  ```

  Para más detalles, [comportamiento del scroll](../advanced/scroll-behavior.md).

### parseQuery / stringifyQuery

> 2.4.0+

- tipo: `Function`

  Provee funciones parse / stringify para _query string_ personalizadas. Sobreescribe la función por defecto.

### fallback

> 2.6.0+

- tipo: `boolean`

  Controla si el router debe o no utilizar el modo `hash` cuando el navegador no soporte `history.pushState`. El valor por defecto es `true`.

  Configurar esto como `false` hace que cada navegación a través de `router-link` sea una recarga completa de la página en IE9. Esto es útil cuando la aplicación es renderizada en el servidor y necesita funcionar en IE9, porque las URL en modo hash no funcionan con SSR.
