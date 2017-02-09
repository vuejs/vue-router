# Pasando Props a componentes de ruteo

Usar `$route` en su componente crea un estrecho acoplamiento con la ruta, lo cual limita la flexibilidad del componente dado que solo puede utilizarse en ciertas URL.

Para desacoplar el componente del enrutador utilice _props_:

**❌ Acoplado a$route**

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

**👍 Desacoplado con props**

``` js
const User = {
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User, props: true }
  ]
})
```

Esto le permite utilizar el componente en cualquier lugar, lo cual hace al mismo reutilizable y más simple de testear.

### Modo booleano

Cuando _props_ tiene asignado el valor true, route.params serán asignados como las _props_ del componente.

### Modo objeto

Cuando _props_ es un objeto, este será asignado tal cual como las _props_ del componente.
Úitl para cuando las _props_ son estáticas.

``` js
const router = new VueRouter({
  routes: [
    { path: '/promotion/from-newsletter', component: Promotion, props: { newsletterPopup: false } }
  ]
})
```

### Modo función

Puede crear una función que retorne _props_.
Esto le permite convertir los parámetros a otro tipo, combinar valores estáticos con valores basados en rutas, etc.

``` js
const router = new VueRouter({
  routes: [
    { path: '/search', component: SearchUser, props: (route) => ({ query: route.query.q }) }
  ]
})
```

La URL: `/search?q=vue` pasaría `{query: "vue"}` como _props_ al componente SearchUser.

Intente crear funciones _props_ sin estado, dado que solo se evalúan cuando ocurren cambios de ruta.
Use un componente envolvente si necesita estado para definir las _props_, de esa manera Vue puede reaccionar a cambios de estado.


Para un uso avanzado, vea el siguiente [ejemplo](https://github.com/vuejs/vue-router/blob/dev/examples/route-props/app.js).
