# Route Meta Fields

Você pode incluir um campo `meta` ao definir uma rota:

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
          // a meta field
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})
```

Então, como podemos acessar o campo `meta`?

Em primeiro lugar, cada objeto de rota na configuração `routes` é chamado de **registro de rota**. Os registros de rota podem ser aninhados. Portanto, quando uma rota é correspondida, ela pode potencialmente corresponder a mais de um registro de rota.

Por exemplo, com a configuração de rota acima, a URL `/foo/bar` combinará tanto a gravação da rota principal quanto a gravação da rota da criança.

Todos os registros de rota correspondentes a uma rota são expostos no objeto `$route` (e também roteiam objetos em guardas de navegação) como a matriz `$route.matched`. Portanto, precisaremos iterar sobre `$route.matched` para verificar meta-campos em registros de rota.

Um exemplo de caso de uso é verificar se há um meta-campo no guarda de navegação global:

``` js
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})
```
