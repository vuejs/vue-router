# Matching dinámico de rutas

Es bastante común tener que mapear rutas con un patrón determinado al mismo componente. Por ejemplo, puede que tengamos un componente `User` el cual debería ser renderizado para todos los usuarios, pero con diferente ID. En `vue-router` podemos usar un segmento dinámico en el _path_ para lograrlo:

``` js
const User = {
  template: '<div>User</div>'
}

const router = new VueRouter({
  routes: [
    // los segmentos dinámicos comienzan con dos puntos
    { path: '/user/:id', component: User }
  ]
})
```

Ahora, las URL como `/user/foo` y `/user/bar` mapearán a la misma ruta.

Un segmento dinámico se representa mediante dos puntos `:`. Cuando se encuentra una coincidencia en la ruta, el valor del segmento dinámico se expondrá como `this.$route.params` en cada componente. Por lo tanto, podremos renderizar el ID del usuario actual modificando el template de `User`de la siguiente manera:

``` js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
```

Puedes consultar el siguiente [ejemplo](http://jsfiddle.net/yyx990803/4xfa2f19/).

Se pueden tener múltiples segmentos dinámicos en la misma ruta, y todos serán mapeados a los correspondientes campos en `$route.params`. Por ejemplo:

| patrón | matching de ruta | $route.params |
|---------|------|--------|
| /user/:username | /user/evan | `{ username: 'evan' }` |
| /user/:username/post/:post_id | /user/evan/post/123 | `{ username: 'evan', post_id: '123' }` |

Además de `$route.params`, el objeto `$route` expone más información útil, como `$route.query` (si hay alguna _query_ en la URL), `$route.hash`, etc. Puedes verificar todos los detalles en la documentación de la [API](../api/route-object.md).

### Reaccionando ante cambios de los parámetros

Una cosa a tener en cuenta cuando se usan rutas con parámetros es que cuando el usuario navega de `/user/foo` a `/user/bar`, **la misma instancia del componente será reutilizada**. Dado que ambas rutas renderizan el mismo componente, esto es más eficiente que destruir la instancia anterior y crear una nueva. **Sin embargo, esto significa que los hooks del ciclo de vida del componentes no serán emitidos**.

Para detectar cambios en los parámetros en el mismo componente, puedes observar el objeto `$route`:

``` js
const User = {
  template: '...',
  watch: {
    '$route' (to, from) {
      // Código que responde al cambio
    }
  }
}
```

O utiliza el guardia de navegación `beforeRouteUpdate` introducido en la versión 2.2:

``` js
const User = {
  template: '...',
  beforeRouteUpdate (to, from, next) {
    // Código que responde al cambio
    // no olvides ejecutar next()
  }
}
```

### Patrones de matching avanzados

`vue-router` usa [path-to-regexp](https://github.com/pillarjs/path-to-regexp) como su motor de búsqueda de patrones, por lo que soporta varios patrones de matching avanzados tales como segmentos dinámicos opcionales, requerimientos del tipo cero o más / uno o más, e incluso patrones _regex_ personalizados. Verifica la  [documentación](https://github.com/pillarjs/path-to-regexp#parameters) para estos patrones avanzados, y [este ejemplo](https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js) de como usarlos con `vue-router`.

### Prioridad en el matching de patrones

A veces la misma URL puede coincidir con múltiples rutas. En ese caso, la prioridad se determina por el orden de la definición de las rutas: la primera ruta definida será la que tenga mayor prioridad.
