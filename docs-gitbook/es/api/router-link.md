# `<router-link>`

`<router-link>` es el componente para posibilitar la navegación de los usuarios en una aplicación con el `router` habilitado. La ubicación destino se especifica con la propiedad `to`. Por defecto, renderiza una etiqueta `<a>` con el atributo `href` correspondiente, pero puede configurarse mediante la propiedad `tag`. Además, el enlace obtiene una clase CSS cuando la ruta a la que apunta es activada.

Es preferible utilizar `<router-link>` en lugar de escribir directamente `<a href="...">` por las siguientes razones:

- Funciona de la misma manera tanto en el modo _hash_ como en el modo historial de HTML5, por lo que si decides intercambiar modos, o cuando el `router` utiliza el modo _hash_ en IE9, no deberás modificar nada.

- En el modo historial de HTML5, `router-link` interceptará el evento _click_ para que el navegador no intente recargar la página.

- Cuando estés utilizando la opción `base` en el modo historial de HTML5, no necesitas incluirla en la URL de la propiedad `to`.

### Propiedades

- **to**

  - tipo: `string | Location`

  - requerida

  Identifica la ruta destino del enlace. Cuando es accedida, el valor de la propiedad `to` será pasado a `router.push()` internamente, por lo que el valor puede ser tanto una cadena de texto como un objeto descriptor de ubicación.

  ``` html
  <!-- cadena de texto -->
  <router-link to="home">Home</router-link>
  <!-- renders to -->
  <a href="home">Home</a>

  <!-- expresión javascript utilizando v-bind -->
  <router-link v-bind:to="'home'">Home</router-link>

  <!-- omitir v-bind es correcto, tal cual se hace con cualquier otra propiedad -->
  <router-link :to="'home'">Home</router-link>

  <!-- lo mismo que el ejemplo anterior -->
  <router-link :to="{ path: 'home' }">Home</router-link>

  <!-- rutas con nombre -->
  <router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>

  <!-- con query, resultando en /register?plan=private -->
  <router-link :to="{ path: 'register', query: { plan: 'private' }}">Register</router-link>
  ```

- **replace**

  - tipo: `boolean`

  - valor por defecto: `false`

  Establecer la propiedad `replace` ejecutará `router.replace()` en lugar de `router.push()` cuando se acceda, por lo que la navegación no dejará un registro en el historial.

  ``` html
  <router-link :to="{ path: '/abc'}" replace></router-link>
  ```

- **append**

  - tipo: `boolean`

  - valor por defecto: `false`

  Establecer la propiedad `append` hará que se agregue la ruta relativa a la ruta actual. Por ejemplo, asumiendo que estamos navegando desde `/a` a un enlace relativo `b`, sin `append` accederemos a `/b`, pero con `append` accederemos a `/a/b`.

  ``` html
  <router-link :to="{ path: 'relative/path'}" append></router-link>
  ```

- **tag**

  - tipo: `string`

  - valor por defecto: `"a"`

  A veces puede que quieras que `<router-link>` se renderice como otra etiqueta, por ejemplo `<li>`. Puedes utilizar la propiedad `tag` para especificar que etiqueta renderizar, y seguirá escuchando eventos _click_ para la navegación.

  ``` html
  <router-link to="/foo" tag="li">foo</router-link>
  <!-- se renderiza como -->
  <li>foo</li>
  ```

- **active-class**

  - tipo: `string`

  - valor por defecto: `"router-link-active"`

  Configura la clase CSS que se aplicará al enlace cuando este activo. Nota que el valor por defecto puede ser configurado de manera global a través de la opción `linkActiveClass`  del constructor del `router`.

- **exact**

  - tipo: `boolean`

  - valor por defecto: `false`

  El comportamiento por defecto para la aplicación de la clase CSS activa en matching dinámico de rutas es **inclusivo**. Por ejemplo, `<router-link to="/a">` obtendrá la clase CSS mientras la ruta actual comience con `/a/` o sea `/a`.

  Una consecuencia de esto es que `<router-link to="/">` ¡permanecerá activa para todas las rutas! Para forzar un matching exacto, utiliza la propiedad `exact`:

  ``` html
  <!-- este enlace estará activo solamente para la ruta / -->
  <router-link to="/" exact>
  ```

  Más ejemplos explicando la clase activa [aquí](https://jsfiddle.net/8xrk1n9f/).

- **event**

  > 2.1.0+

  - tipo: `string | Array<string>`

  - valor por defecto: `'click'`

  Son los eventos que permiten lanzar la navegacion.

- **exact-active-class**

  > 2.5.0+

  - tipo: `string`

  - valor por defecto: `"router-link-exact-active"`

  Configura la clase CSS activa que será aplicada cuando el enlace esté activo con una coincidencia de ruta exacta. Ten en cuenta que el valor por defecto también puede configurarse globalmente a través de la opción `linkExactActiveClass` del constructor del router.

### Aplicar la clase activa al elemento envolvente.

A veces puede que queramos que la clase activa se aplique al elemento envolvente en lugar de aplicarla directamente a la etiqueta `<a>`. En ese caso, puedes renderizar el elemento envolvente utilizando `<router-link>` y luego una etiqueta `<a>` dentro:

``` html
<router-link tag="li" to="/foo">
  <a>/foo</a>
</router-link>
```

En este caso, la etiqueta `<a>` será el enlace (y obtendrá el atributo `href` correcto), pero la clase activa será aplicada al elemento envolvente `<li>`.
