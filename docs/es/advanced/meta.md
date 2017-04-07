# Campos Meta en las rutas

Puedes incluir un campo `meta` cuando definas una ruta:

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      children: [
        {
          path: 'bar',
          component: Bar,
          // campo meta
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})
```

Entonces, ¿como accedemos al campo `meta`?

Primero, cada objeto route en la configuración de `routes` se llama **registro de ruta**. Los registros de ruta pueden estar anidados. Por lo tanto, cuando una ruta coincida, existe la posibilidad que lo haga con más de un registro de ruta.

Por ejemplo, con la configuración anterior, la URL `/foo/bar` coincidirá tanto con el registro de ruta padre como con el hijo.

Todos los registros de rutas que hayan coincidido son expuestos en el objeto `$route` (y también a los objetos route en las guardias de navegación) como el array `$route.matched`. Por ende, necesitaremos iterar sobre `$route.matched` para verificar campos meta en los registros de rutas.

Un caso de uso de ejemplo es verificar la existencia de campos metas en los guardias de navegación global:

``` js
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // esta ruta requiere autenticación, verificamos que haya iniciado sesión
    // sino, redirigimos a la página de inicio de sesión.
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // ¡Asegúrate de ejecutar next siempre!
  }
})
```
