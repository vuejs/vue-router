# Pasando propiedades a componentes de ruteo

Usar `$route` en tu componente genera un acoplamiento estrecho con la ruta, lo cual limita la flexibilidad del componente dado que solo puede utilizarse en ciertas URL.

Para desacoplar el componente del enrutador utiliza _props_:

** Acoplado a $route**

``` js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User }
  ]
})
```

** Desacoplado con props**

``` js
const User = {
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User, props: true },

    // utilizando vistas con nombre, tienes que definir la opción prop para cada una de ellas:
    {
      path: '/user/:id',
      components: { default: User, sidebar: Sidebar },
      props: { default: true, sidebar: false }
    }
  ]
})
```

Esto te permite utilizar el componente en cualquier lugar, lo cual hace al mismo reutilizable y más sencillo de testear.

### Modo boolean

Cuando _props_ tiene asignado el valor true, `route.params` serán asignados como las _props_ del componente.

### Modo objeto

Cuando _props_ es un objeto, este será asignado tal cual como las _props_ del componente.
Útil para cuando las _props_ son estáticas.

``` js
const router = new VueRouter({
  routes: [
    { path: '/promotion/from-newsletter', component: Promotion, props: { newsletterPopup: false } }
  ]
})
```

### Modo función

Puedes crear una función que retorne _props_.
Esto te permite convertir los parámetros a otro tipo, combinar valores estáticos con valores basados en rutas, etc.

``` js
const router = new VueRouter({
  routes: [
    { path: '/search', component: SearchUser, props: (route) => ({ query: route.query.q }) }
  ]
})
```

La URL: `/search?q=vue` pasaría `{query: "vue"}` como _props_ al componente SearchUser.

Intenta crear funciones _props_ sin estado, dado que solo se evalúan cuando ocurren cambios de ruta.
Utiliza un componente envolvente si necesitas estado para definir las _props_, de esa manera Vue puede reaccionar a cambios de estado.


Para un uso avanzado, aquí hay un [ejemplo](https://github.com/vuejs/vue-router/blob/dev/examples/route-props/app.js).
