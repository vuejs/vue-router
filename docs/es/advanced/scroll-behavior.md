# Comportamiento del desplazamiento

Cuando se utiliza enrutamiento del lado cliente, podemos querer desplazarnos hacia el tope de la página cuando naveguemos a una nueva ruta, o preservar la posicón actual, tal cual lo hace una recarga de la página. `vue-router` te permite lograr esto e incluso más: permite personalizar completamente el comportamiento del desplazamiento en las navegaciones.

**Nota: esta característica solo funciona en el modo historial de HTML5.**

Cuando crees una instancia del enrutador, puedes incluir la función `scrollBehavior`:

``` js
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // devolver la posición deseada
  }
})
```

La función `scrollBehavior` recibe los objetos de ruta `to` y `from`. El tercer parámetro, `savedPosition`, solo está disponible si estamos en una navegación `popstate` (cuando se utilizan los botones _atras_ o _adelante_ en el navegador).

La función puede devolver un objeto de posición de desplazamiento. El objeto puede ser de la forma:

- `{ x: number, y: number }`
- `{ selector: string }`

Si se devuelve un valor *falso* o un objeto vacio, no ocurrirá ningún desplazamiento.

Por ejemplo:

``` js
scrollBehavior (to, from, savedPosition) {
  return { x: 0, y: 0 }
}
```

Esto hará que la página se desplace hacia el tope para todas las navegaciones a la ruta.

Devolver `savedPosition` hará que el comportamiento cuando se utilicen los botones _atras_ o _adelante_ sea el nativo:

``` js
scrollBehavior (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}
```

Si deseas simular el desplazamiento a anclas:

``` js
scrollBehavior (to, from, savedPosition) {
  if (to.hash) {
    return {
      selector: to.hash
    }
  }
}
```

También podemos utilizar [campos meta](meta.md) para implementar un control de desplazamientoto fino. Un ejemplo completo [aquí](https://github.com/vuejs/vue-router/blob/dev/examples/scroll-behavior/app.js).
