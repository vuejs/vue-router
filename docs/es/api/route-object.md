# El objeto Route

Un **objeto Route** representa el estado de la ruta activa actualmente. Contiene información analizada de la URL actual y los **registros de rutas** que coinciden con ella.

El objeto `Route` es inmutable. Cada navegación exitosa resultará en un nuevo objeto `Route`.

El objeto `Route` puede encontrarse en diferentes lugares.

- Dentro de los componentes, como `this.$route`

- Dentro de las _funciones callbacks_ de observación de `$route`

- Como valor de retorno de la función `router.match(location)`

- Dentro de las guardias de navegación como los primeros dos argumentos:

  ``` js
  router.beforeEach((to, from, next) => {
    // to y from son objetos de ruta
  })
  ```

- Dentro de la función `scrollBehavior`como los primeros dos argumentos:

  ``` js
  const router = new VueRouter({
    scrollBehavior (to, from, savedPosition) {
      // to y from son objetos de ruta
    }
  })
  ```

### Propiedades del objeto Route

- **$route.path**

  - tipo: `string`

    Una cadena de texto equivalente a la ruta actual, siempre resuelta como una ruta absoluta. Por ejemplo`"/foo/bar"`.

- **$route.params**

  - tipo: `Object`

    Un objeto que contiene pares llave/valor de segmentos dinámicos y segmentos estrella. Si no hay parametros, el valor será un objeto vacio.

- **$route.query**

  - tipo: `Object`

    Un objeto que contiene pares llave/valor del _query string_. Por ejemplo, para la ruta `/foo?user=1`, obtendremos `$route.query.user == 1`. Si no hay _query string_ el valor será un objeto vacio.

- **$route.hash**

  - tipo: `string`

    El _hash_ de la ruta actual (con la `#`), si posee. Si no hay un _hash_ el valor será una cadena de texto vacia.

- **$route.fullPath**

  - tipo: `string`

    La URL completa incluyendo _query_ y _hash_.

- **$route.matched**

  - tipo: `Array<RouteRecord>`

  Un array que contiene **registros de ruta** para todos los segmentos anidados de la ruta actual. Los registros de ruta son copias de los objetos en el array de configuración `routes` (y en los arrays `children`):

  ``` js
  const router = new VueRouter({
    routes: [
      // el siguiente objeto es un registro de ruta
      { path: '/foo', component: Foo,
        children: [
          // este también es un registro de ruta
          { path: 'bar', component: Bar }
        ]
      }
    ]
  })
  ```

  Cuando la URL es `/foo/bar`, `$route.matched` será un array que contendrá ambos objetos (clonados), en orden descendente de padre a hijo.

- **$route.name**

  El nombre de la ruta acutal, si tiene. (Más información en [rutas con nombre](../essentials/named-routes.md))
