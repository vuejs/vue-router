# Route Meta-Felder

In der Route-Definition kann man ein Meta-Feld definieren:

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

Und wie greifen wir auf das `meta`-Feld zu?

Zunächst einmal: Wir nennen jedes Route-Objekt in der `routes`-Konfiguration **Route-Record**. Route-Records können verschachtelt sein, weshalb eine URL potentiell zu mehreren Route-Records passen kann.

Zum Beispiel werden mit der obigen Konfiguration und der URL `/foo/bar` beide - Parent-Record und Child-Record - gematched.

Alle Route-Records, die auf eine URL zutreffen, sind im `$route`-Objekt und in den Route-Objekten in Navigation-Guards im `$route.matched`-Array zu finden. Deswegen müssen wir mit einer Schleife das `$route.matched` Array durchlaufen, um alle Route-Records auf Metafelder zu prüfen.

Ein Anwendungsfall ist die Prüfung nach einem Metafeld im globalen Before-Guard:

``` js
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Diese Route benötigt Authentifizierung und prüft,
    // ob man eingeloggt ist.
    // Wenn nicht, Redirect zur Login-Seite.
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
