# Rutas con nombre

 A veces es conveniente identificar una ruta con un nombre, especialmente cuando enlazamos a esa ruta o navegamos mediante código. Puedes darle un nombre a una ruta en las opciones de `routes` cuando se crea la instancia de Router:

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:userId',
      name: 'user',
      component: User
    }
  ]
})
```

Para enlazar a una ruta con nombre, puedes pasar un objeto a la propiedad `to` del componente `router-link`:

``` html
<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
```

Este es exactamente el mismo objeto utilizado mediante código con `router.push()`:

``` js
router.push({ name: 'user', params: { userId: 123 }})
```

En ambos casos, el _router_ navegará a la ruta `/user/123`.

Revisa un ejemplo completo [aquí](https://github.com/vuejs/vue-router/blob/dev/examples/named-routes/app.js).
