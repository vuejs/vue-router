# Optionen des Router-Konstruktors

### routes

- Typ: `Array<RouteConfig>`

  Typendeklaration für `RouteConfig`:

  ``` js
  declare type RouteConfig = {
    path: string;
    component?: Component;
    name?: string; // für benannte Routes
    components?: { [name: string]: Component }; // für benannte Views
    redirect?: string | Location | Function;
    alias?: string | Array<string>;
    children?: Array<RouteConfig>; // für Verschachtelte Routes
    beforeEnter?: (to: Route, from: Route, next: Function) => void;
    meta?: any;
  }
  ```

### mode

- Typ: `string`

- Default: `"hash" (in browser) | "abstract" (in Node.js)`

- verfügbare Werte: `"hash" | "history" | "abstract"`

  Bestimmt den Router-Mode.

  - `hash`: Nutzt den URL-Hash für das Routing. Funktioniert in allen Vue-unterstützten Browsern, inklusive derer, die die HTML5 Verlaufs-API nicht unterstützen.

  - `history`: Benötigt die HTML5 Verlaufs-API und Serverkonfiguration. Siehe [HTML5 Verlaufsmodus](../essentials/history-mode.md).

  - `abstract`: Funktioniert in jeder JavaScript-Umgebung, zB. serverseitig mit Node.js. **Der Router wird automatisch in diesen Modus gezwungen, wenn keine Browser-API vorhanden ist.**

### base

- Typ: `string`

- Default: `"/"`

  Die Basis-URL der App. Läuft zum Beispiel die gesamte Single-Page-Applikation unter `/app`, sollte `base` den Wert `"/app"` haben.

### linkActiveClass

- Typ: `string`

- Default: `"router-link-active"`

  Definiert global den Namen der "active" Klasse für `<router-link>`. Siehe auch [router-link](router-link.md).

### scrollBehavior

- Typ: `Function`

  Signatur:

  ```
  (
    to: Route,
    from: Route,
    savedPosition?: { x: number, y: number }
  ) => { x: number, y: number } | { selector: string } | ?{}
  ```

  Für mehr Details siehe [Scroll-Verhalten](../advanced/scroll-behavior.md).
