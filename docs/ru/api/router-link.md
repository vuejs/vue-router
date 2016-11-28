# `<router-link>`

`<router-link>` — это компонент, используемый для создания ссылок в приложениях, использующих клиентский роутинг. Целевой путь указывается во входном параметре `to`. По умолчанию используется тег `<a>` и параметр `href`, но это поведение можно изменить входным параметром `tag`. Кроме того, для ссылки автоматически устанавливается CSS-класс при активации соответствующего пути.

Использование `<router-link>` предпочтительнее, чем создание ссылок `<a href="...">` вручную, по следующим причинам:

- Единообразие вне зависимости от используемого режима навигации (HTML history или хеши), из-за чего не потребуется вносить изменения в код, если вы захотите сменить режим (или если приложение будет открыто в IE9, не поддерживающем HTML history mode).

- В HTML5 history mode, `router-link` перехватывает клики, что предотвращает попытки браузера перезагрузить страницу.

- При использовании опции `base` в HTML5 history mode, нет необходимости включать префиксы URL при указании входных параметров `to`.

### Входные параметры

- **to**

  - тип: `string | Location`

  - обязательный

  Denotes the target route of the link. When clicked, the value of the `to` prop will be passed to `router.push()` internally, so the value can be either a string or a location descriptor object.

  ``` html
  <!-- literal string -->
  <router-link to="home">Home</router-link>
  <!-- renders to -->
  <a href="home">Home</a>

  <!-- javascript expression using v-bind -->
  <router-link v-bind:to="'home'">Home</router-link>

  <!-- Omitting v-bind is fine, just as binding any other prop -->
  <router-link :to="'home'">Home</router-link>

  <!-- same as above -->
  <router-link :to="{ path: 'home' }">Home</router-link>

  <!-- named route -->
  <router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>

  <!-- with query, resulting in /register?plan=private -->
  <router-link :to="{ path: 'register', query: { plan: 'private' }}">Register</router-link>
  ```

- **replace**

  - тип: `boolean`

  - значение по умолчанию: `false`

  Setting `replace` prop will call `router.replace()` instead of `router.push()` when clicked, so the navigation will not leave a history record.

  ``` html
  <router-link :to="{ path: '/abc'}" replace></router-link>
  ```

- **append**

  - тип: `boolean`

  - значение по умолчанию: `false`

  Setting `append` prop always appends the relative path to the current path. For example, assuming we are navigating from `/a` to a relative link `b`, without `append` we will end up at `/b`, but with `append` we will end up at `/a/b`.

  ``` html
  <router-link :to="{ path: 'relative/path'}" append></router-link>
  ```

- **tag**

  - тип: `string`

  - значение по умолчанию: `"a"`

  Время от времени хотелось бы, чтобы `<router-link>` использовал иной тег, например `<li>`. Мы можем использовать входной параметр `tag` для этих целей, и получившийся элемент всё так же будет реагировать на клики для навигации.

  ``` html
  <router-link to="/foo" tag="li">foo</router-link>
  <!-- отобразится как -->
  <li>foo</li>
  ```

- **active-class**

  - тип: `string`

  - значение по умолчанию: `"router-link-active"`

  В этом параметре можно изменить CSS-класс, применяемый к активным ссылкам. Обратите внимание, что значение по умолчанию тоже может быть изменено при помощи опции `linkActiveClass` конструктора роутера.

- **exact**

  - тип: `boolean`

  - значение по умолчанию: `false`

  По умолчанию активность ссылки устанавливается по стратегии **совпадения по включению**. Например, для `<router-link to="/a">` класс активности будет применён для всех ссылок, начинающися с `/a`.

  Одним из следствий этого подхода является тот факт, что корневая ссылка `<router-link to="/">` будет считаться активной всегда. Чтобы заставить ссылку считаться активной только при полном совпадении, используйте входной параметр `exact`:

  ``` html
  <!-- эта ссылка будет активной только для корневого пути / -->
  <router-link to="/" exact>
  ```

  Больше примеров с подробными объяснениями насчёт класса активности можно найти [здесь](http://jsfiddle.net/fnlCtrl/dokbyypq/).

### Применение класса активности ко внешнему элементу

Иногда хочется применить класс активности не к самому тегу `<a>`, а к другому элементу. Для этих целей можно использовать `<router-link>` для наружного элемента, а ссылку разместить внутри вручную:

``` html
<router-link tag="li" to="/foo">
  <a>/foo</a>
</router-link>
```

Vue-router поймёт, что в качестве ссылки нужно использовать вложенный элемент (и укажет правильное значение `href` для неё), но класс активности будет применяться ко внешнему `<li>`.
