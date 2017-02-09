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
    children?: Array<RouteConfig>; // para rutas anidadas
    beforeEnter?: (to: Route, from: Route, next: Function) => void;
    meta?: any;
  }
  ```

### mode

- tipo: `string`

- valor por defecto: `"hash" (in browser) | "abstract" (in Node.js)`

- valores disponibles: `"hash" | "history" | "abstract"`

  Configura el modo del enrutador.

  - `hash`: utiliza el _hash_ en la URL para el enrutamiento. Funciona en todos los navegadores que soportan Vue, incluidos aquellos que no soportan la API de historial de HTML5 .

  - `history`: requiere la API de historial de HTML y configuración del lado servidor. Vea [Modo historial HTML5](../essentials/history-mode.md).

  - `abstract`: funciona en todos los ambientes de JavaScript, por ejemplo, del lado servidor con Node.js. **Se forzará este modo de trabajo en el enrutador si no se detecta la API de navegador.**

### base

- tipo: `string`

- valor por defecto: `"/"`

  La URL base para la aplicación. Por ejemplo, si toda la aplicación se encuentra dentro de `/app/`, entonces `base` debería llevar ese valor.

### linkActiveClass

- tipo: `string`

- valor por defecto: `"router-link-active"`

  Configura globalmente la clase activa por defecto de `<router-link>`. Vea también [router-link](router-link.md).

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

  Para más detalles vea [Comportamiento del desplazamiento](../advanced/scroll-behavior.md).
