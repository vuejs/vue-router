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
    props?: boolean | string | Function;
    alias?: string | Array<string>;
    children?: Array<RouteConfig>; // для вложенных путей
    beforeEnter?: (to: Route, from: Route, next: Function) => void;
    meta?: any;

    // 2.6.0+
    caseSensitive?: boolean; // учитывать ли регистр при сравнении? (по умолчанию: false)
    pathToRegexpOptions?: Object; // настройки path-to-regexp для компиляции regex
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

### linkExactActiveClass

> Добавлено в версии 2.5.0+

- Тип: `string`

- По умолчанию: `"router-link-exact-active"`

  Глобально настраивает для `<router-link>` активный класс по умолчанию для точных совпадений маршрута. См. также [router-link](router-link.md).

### scrollBehavior

- тип: `Function`

  Сигнатура:

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

  Для подробностей см. [Скроллинг](../advanced/scroll-behavior.md).

### parseQuery / stringifyQuery

> Добавлено в версии 2.4.0+

- Тип: `Function`

  Пользовательские функции для парсинга строки запроса / приведения к строке запроса (функции stringify). Переопределяют значения по умолчанию.

### fallback

> 2.6.0+

- Тип: `boolean`

  Контролирует, должен ли маршрутизатор возвращаться в режим `hash`, когда браузер не поддерживает `history.pushState`. По умолчанию значение `true`.

  Установка этого параметра в `false` будет вызывать для каждой навигации через `router-link` полное обновление страницы в IE9. Это может быть полезным, когда приложение рендерится на стороне сервера и должно работать в IE9, потому что режим `hash` не работает с SSR.
