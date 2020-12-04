# Meta Campos da Rota

Você pode incluir um `meta` campo quando estiver definindo uma rota:

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
         // um meta campo
         meta: { requiresAuth: true }
       }
     ]
   }
 ]
})
```

Então como nós acessamos este campo meta?

Primeiro, cada objeto de rota na configuração de `routes` é chamado como uma **rota de gravação (rote record)**. Rotas de gravação podem ser aninhadas. Logo quando uma rota é capturada, ela pode potencialmente capturar mais de uma rota de gravação.

Por exemplo, com a configuração de rota acima, a URL `/foo/bar` irá capturar ambas rotas de gravação tanto do pai e a do filho.

Todas as rotas de gravação capturadas por uma rota são expostas no objeto `$route` (e também nos objetos de rotas na guarda de navegação) como o array `$route.matched`. Logo, nós iremos precisar interar sobre `$route.matched` para procurar por meta campos nas rotas de gravação.

Um exemplo de caso de uso é procurar por um meta campo na guarda de navegação global:

``` js
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // esta rota requer autorização, verifique se está logado
    // se não, redireciona para a página login.
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // certifique-se de sempre invocar a função next()
  }
})
```
