# Redirection et alias

### Redirection

Les redirections peuvent aussi être faites depuis la configuration de `routes`. Pour rediriger `/a` vers `/b` :

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: '/b' }
  ]
})
```

La redirection peut également être effectuée en ciblant une route nommée :

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: { name: 'foo' }}
  ]
})
```

Ou on peut même utiliser une fonction pour les redirections dynamiques :

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: to => {
      // la fonction reçoit la route cible en tant qu'argument
      // retournez le chemin vers la nouvelle route ici.
    }}
  ]
})
```

Notez que les [intercepteurs de navigation](../advanced/navigation-guards.md) ne sont pas appliqués sur les routes d'où à lieu la redirection mais uniquement sur les routes cibles. Dans l'exemple ci-dessous, ajouter une interception `beforeEnter` ou `beforeLeave` à la route `/a` n'aura aucun effet.

Pour d'autres utilisations avancées, jetez un œil à cet [exemple](https://github.com/vuejs/vue-router/blob/dev/examples/redirect/app.js).

### Alias

Une redirection signifie que si l'utilisateur visite `/a`, l'URL va être remplacé par `/b` et concordé avec `/b`. Mais qu'est-ce qu'un alias ?

** Un alias de `/a` en tant que `/b` signifie que lorsque l'utilisateur va visiter `/b`, l'URL va rester `/b`, mais la concordance va se faire comme si l'utilisateur visitait `/a`.**

La phase du dessus peut être exprimée dans la configuration de la route de la manière suivante :

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/b' }
  ]
})
```

Un alias vous donne la liberté d'associer une structure d'interface utilisateur à un URL arbitraire, au lieu d'être contraint par une configuration de structure.

Pour d'autres utilisations avancées, jetez un œil à cet [exemple](https://github.com/vuejs/vue-router/blob/dev/examples/route-alias/app.js).
