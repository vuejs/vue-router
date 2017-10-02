# Champs meta de route

Vous pouvez inclure un champ `meta` quand vous définissez une route :

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
          // un champ `meta`
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})
```

Comment maintenant accéder à ce champ `meta` ?

Tout d'abord, chaque objet route dans la configuration de `routes` est appelé un **registre de route**. Les registres de route peuvent être imbriqués. Par conséquent, quand une route concorde, elle peut potentiellement concorder avec plus d'un registre de route.

Par exemple, avec la configuration de route ci-dessous, l'URL `/foo/bar` va concorder avec le registre parent et le registre enfant.

Tous les registres concordants avec une route sont exposés dans l'objet `$route` (ainsi que les objets de route dans les sécurisations de navigation) dans le tableau `$route.matched`. Donc, nous devons itérer à travers `$route.matched` pour vérifier les champs meta dans les registres de route.

Un exemple concret est la vérification d'un champ meta dans une interception de navigation globale :

``` js
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // cette route demande une autorisation, vérifions si l'utilisateur est logué.
    // sinon, redirigeons le sur la page de login.
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // assurez vous de toujours appeler `next()` !
  }
})
```
