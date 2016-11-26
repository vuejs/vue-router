# Benannte Routes

Manchmal ist es einfacher einer Route einen Namen zu geben, speziell bei der Verlinkung einer Route oder dem Ausführen von Navigationen. Den Namen vergibt man bei der Kreation der Router-Instanz in den `routes`-Optionen:

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

Um `router-link` mit der jeweils benannten Route zu verlinken, gibt man ein Objekt in dem `to`-Prop ein:

``` html
<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
```

Dies ist das exakt gleiche Objekt, wie es programmatisch in `router.push()` genutzt wird.


``` js
router.push({ name: 'user', params: { userId: 123 }})
```

In beiden Fällen wird der Router zum Pfad `/user/123` navigieren.

Vollständiges Beispiel [hier](https://github.com/vuejs/vue-router/blob/dev/examples/named-routes/app.js).
