# Опции конструктора Router'а

### routes

- тип: `Array<RouteConfig>`

  Декларация типа для `RouteConfig`:

  ``` js
  declare type RouteConfig = {
    path: string;
    component?: Component;
    name?: string; // для именованных путей
    components?: { [name: string]: Component }; // для именованных представлений
    redirect?: string | Location | Function;
    alias?: string | Array<string>;
    children?: Array<RouteConfig>; // для вложенных путей
    beforeEnter?: (to: Route, from: Route, next: Function) => void;
    meta?: any;
  }
  ```

### mode

- тип: `string`

- значение по умолчанию: `"hash" (in browser) | "abstract" (in Node.js)`

- возможные значения: `"hash" | "history" | "abstract"`

  Указывает режим работы роутера.

  - `hash`: для роутинга будут использоваться URL-хэши. Работает во всех поддерживаемых браузерах, включая те, что не поддерживают HTML5 History API.

  - `history`: требует для работы поддержку HTML5 History API в браузере с соответствующую конфигурацию сервера. См. [раздел документации об использовании режима HTML5 History](../essentials/history-mode.md).

  - `abstract`: работает в любом JavaScript-окружении, включая серверный рендеринг с помощью Node.js. **Роутер переключается в этот режим автоматически, если не обнаруживает API браузера.**

### base

- тип: `string`

- значение по умолчанию: `"/"`

  Базовый URL приложения. Например, если SPA находится по пути `/app/`, значением `base` также должно быть `"/app/"`.

### linkActiveClass

- тип: `string`

- значение по умолчанию: `"router-link-active"`

  Глобальная конфигурация CSS-класса по умолчанию для активных ссылок `<router-link>`. См. также [router-link](router-link.md).

### scrollBehavior

- тип: `Function`

  Сигнатура:

  ```
  (
    to: Route,
    from: Route,
    savedPosition?: { x: number, y: number }
  ) => { x: number, y: number } | { selector: string } | ?{}
  ```

  Для подробностей см. [Скроллинг](../advanced/scroll-behavior.md).
