# Инстанс Router'а

### Свойства

#### router.app

- тип: `Vue instance`

  Корневой инстанс Vue, в который был интегрирован `router`.

#### router.mode

- тип: `string`

  [Режим](options.md#mode), используемый роутером.

#### router.currentRoute

- тип: `Route`

  Текущий путь в виде [объекта Route](route-object.md).

### Методы

- **router.beforeEach(guard)**
- **router.afterEach(hook)**

  См. [сторожевые хуки](../advanced/navigation-guards.md).


- **router.push(location)**
- **router.replace(location)**
- **router.go(n)**
- **router.back()**
- **router.forward()**

  Методы для императивного перехода к новому URL. См. [Императивная навигация](../essentials/navigation.md).

- **router.getMatchedComponents(location?)**

  Возвращает массив компонентов (определение/конструктор, не инстансы), совпадающих с текущим путём. В основном используется во время рендеринга на сервере для получения необходимых данных.

- **router.resolve(location, current?, append?)**

  > 2.1.0+

  Служит для обратного разрешения URL. Получая на вход путь в том же формате, что используется `<router-link/>`, возвращает объект со следующими свойствами:

  ``` js
  {
    normalizedTo: Location;
    resolved: Route;
    href: string;
  }
  ```