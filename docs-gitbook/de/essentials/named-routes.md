# Benannte Routes

Manchmal ist es einfacher, eine Route mit einem Namen anzusprechen. Besonders bei Links zu einer Route oder dem Ausführen von Navigationen. Den Namen vergibt man beim Erzeugen der Router-Instanz in den `routes`-Optionen:

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

Um mit `router-link` zu einer benannten Route zu verlinken, gibt man ein Objekt in die `to`-Prop ein:

``` html
<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
```

Das exakt gleiche Objekt kann auch programmatisch in `router.push()` genutzt werden.


``` js
router.push({ name: 'user', params: { userId: 123 }})
```

In beiden Fällen wird der Router zum Pfad `/user/123` navigieren.

Vollständiges Beispiel [hier](https://github.com/vuejs/vue-router/blob/dev/examples/named-routes/app.js).
