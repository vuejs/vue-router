# Comportamiento del scroll

Cuando se utiliza enrutamiento del lado cliente, podemos querer hacer `scroll` hacia el inicio de la página cuando naveguemos a una nueva ruta, o preservar la posición actual, tal cual lo hace una recarga de la página. `vue-router` te permite lograr esto e incluso más: permite personalizar completamente el comportamiento del `scroll` durante la navegación.

**Nota: esta característica solo funciona en el modo historial de HTML5.**

Cuando crees una instancia del `router`, puedes incluir la función `scrollBehavior`:

``` js
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // devolver la posición deseada
  }
})
```

La función `scrollBehavior` recibe los objetos de ruta `to` y `from`. El tercer parámetro, `savedPosition`, solo está disponible si estamos en una navegación `popstate` (cuando se utilizan los botones _atrás_ o _adelante_ en el navegador).

La función puede devolver un objeto de posición de `scroll`. El objeto puede ser de la forma:

- `{ x: number, y: number }`
- `{ selector: string, offset? : { x: number, y: number }}` (offset solo soportado a partir de la versión 2.6.0+)

Si se devuelve un valor *falso* o un objeto vacio, no ocurrirá ningún desplazamiento.

Por ejemplo:

``` js
scrollBehavior (to, from, savedPosition) {
  return { x: 0, y: 0 }
}
```

Esto hará que la página se desplace hacia el inicio para todas las navegaciones a la ruta.

Devolver `savedPosition` hará que el comportamiento cuando se utilicen los botones _atrás_ o _adelante_ sea el nativo:

``` js
scrollBehavior (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}
```

Si deseas simular el `scroll` hacia anclas:

``` js
scrollBehavior (to, from, savedPosition) {
  if (to.hash) {
    return {
      selector: to.hash
      // , offset: { x: 0, y: 10 }
    }
  }
}
```

También podemos utilizar [campos meta](meta.md) para implementar un control de `scroll` fino. Un ejemplo completo [aquí](https://github.com/vuejs/vue-router/blob/dev/examples/scroll-behavior/app.js).
