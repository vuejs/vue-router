# Route-Metafelder

Man kann ein Metafeld einfügen, wenn die Route definiert wird:

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
          // ein Metafeld
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})
```

Wie greift man auf das `meta`-Feld zu?

Zunächst einmal wird jedes Route-Objekt in der `routes`-Konfiguration **Route-Eintrag** genannt. Route-Einträge können verschachtelt sein. Deswegen kann eine Route zu mehreren Einträgen passen, wenn sie besucht wird.

Zum Beispiel werden mit der obigen Konfiguration und der URL `/foo/bar` beide - Parent-Eintrag und Child-Eintrag - angesprochen.

Alle Route-Einträge, die auf eine Route zutreffen, sind im `$route`-Objekt und in Route-Objekten im Navigationschutz als `$route.matched`-Array vorzufinden. Deswegen muss eine Schleife auf `$route.matched` angewandt werden, um alle Metafelder im Route-Eintrag zu erhalten.

Ein Beispiel ist die Prüfung nach einem Metafeld im globalen Navigationsschutz:

``` js
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Diese Route benötigt Authentifizierung und prüft,
    // ob man eingeloggt ist.
    // Wenn nicht, Umleitung zur Login-Seite.
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // Rufe immer next() auf.
  }
})
```
