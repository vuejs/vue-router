# Intercepteurs de navigation

Comme le nom le suggère, l'interception de navigation fournie par `vue-router` est principalement utilisée pour intercepter la navigation avec des redirections ou des annulations d'accès. Il y a plusieurs hooks disponibles lors du processus de navigation : globaux, par route ou par composant.

Souvenez-vous de cela : **le changement de paramètre ou de query ne va pas lancer d'interception d'entrée ou de sortie de navigation**. Vous pouvez toujours [observer l'objet `$route`](../essentials/dynamic-matching.md#reacting-to-params-changes) pour réagir à ces changements, ou utiliser la fonction `beforeRouteUpdate` d'une interception par composant.

## Interception globale

Vous pouvez abonner une interception d'entrée en utilisant `router.beforeEach` :

``` js
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  // ...
})
```

Les interceptions d'entrées globales sont appelées lors de l'ordre de création, chaque fois qu'une navigation est déclenchée. Les interceptions peuvent être résolues de manière asynchrone, et la navigation est considérée comme **en attente** avant que tous les hooks ne soient résolus.

Chaque fonction d'interception reçoit trois arguments :

- **`to: Route`**: L'[objet `Route`](../../api/#the-route-object) cible vers lequel on navigue.

- **`from: Route`**: la route courante depuis laquelle nous venons de naviguer.

- **`next: Function`**: cette fonction doit être appelée pour **résoudre** le hook. L'action dépend des arguments fournis à `next`:

  - **`next()`**: se déplacer jusqu'au prochain hook du workflow. S'il ne reste aucun hook, la navigation est **confirmée**.

  - **`next(false)`**: annuler la navigation courante. Si l'URL du navigateur avait changé (manuellement par l'utilisateur ou via le bouton retour du navigateur), il sera remis à sa valeur de route de `from`.

  - **`next('/')` ou `next({ path: '/' })`**: redirige vers le nouvel URL. La navigation courante va être arrêtée et une nouvelle va se lancer. Vous pouvez passer n'importe quel objet à `next`, vous permettant ainsi de spécifier des options comme `replace: true`, `name: 'home'` et n'importe quelles options dans [la prop `to` du `router-link`](../../api/#to) ou [`router.push`](../../api/#routeur-push).

  - **`next(error)`**: (2.4.0+) si l'argument passé à `next` est une instance de `Error`, la navigation va s'arrêter et l'erreur sera passée aux fonctions de rappel enregistrées via [`router.onError()`](../../api/#router-onerror).

**Assurez-vous de toujours appeler la fonction `next`, sinon le hook ne sera jamais résolu.**

## Résolutions des interceptions globales

Vous pouvez abonner une interception globale avec `router.beforeResolve`. Ceci est similaire a `router.beforeEach`, mais la différence est qu'elle sera appelée juste après que la navigation soit confirmée, **après que toutes les interceptions par composants et les composants de route asynchrone ait été résolu**.

## Hooks de sortie globaux

Vous pouvez également abonner des hooks de sortie, cependant, à la différence des interceptions, ces hooks ne fournissent pas de fonction `next` et n'affecte pas la navigation :

``` js
router.afterEach((to, from) => {
  // ...
})
```

## Interception par route

Vous pouvez définir l'interception `beforeEnter` directement sur l'objet de configuration d'une route :

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      }
    }
  ]
})
```

Ces interceptions ont exactement le même effet que les interceptions globales d'entrée.

## Interception par composant

Enfin, vous pouvez directement définir une interception de navigation a l'intérieur du composant lui-même (celui passé à la configuration du routeur) avec les options suivantes :

- `beforeRouteEnter`
- `beforeRouteUpdate`
- `beforeRouteLeave`

``` js
const Foo = {
  template: `...`,
  beforeRouteEnter (to, from, next) {
    // appelée avant que la route vers le composant soit confirmée.
    // cette fonction n'a pas accès à l'instance du composant avec `this`,
    // car le composant n'a pas encore été créé quand cette interception est appelée !
  },
  beforeRouteUpdate (to, from, next) {
    // appelée quand la route qui fait le rendu de ce composant change,
    // mais que ce composant est utilisé de nouveau dans la nouvelle route.
    // Par exemple, pour une route avec le paramètre dynamique `/foo/:id`, quand nous
    // naviguons entre `/foo/1` et `/foo/2`, la même instance du composant `Foo`
    // va être réutilisée, et ce hook va être appelé quand cela arrivera.
    // ce hook a accès à l'instance de ce composant via `this`.
  },
  beforeRouteLeave (to, from, next) {
    // appelée quand la route qui fait le rendu de ce composant est sur le point
    // d'être laissée en faveur de la prochaine route.
    // elle a accès à l'instance de ce composant via `this`.
  }
}
```

L'interception `beforeRouteEnter` **n'a PAS** accès à `this`, car l'interception est appelée avant que la navigation soit confirmée, et le nouveau composant entrant n'a même pas encore été créé.

Cependant, vous pouvez accéder à l'instance en passant dans la fonction de rappel `next`. Cette fonction de rappel va être appelée quand la navigation sera confirmée, et l'instance du composant sera passée à la fonction de rappel en tant qu'argument :

``` js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // accès à l'instance du composant via `vm`
  })
}
```

Notez que `beforeRouteEnter` est la seule interception qui supporte une fonction de rappelle dans `next`. Pour `beforeRouteUpdate` et `beforeRouteLeave`, `this` est déjà disponible. Le passage d'une fonction de rappel n'étant pas nécessaire, il n'est donc pas *supporté* :

```js
beforeRouteUpdate (to, from, next) {
  // utiliser juste `this`
  this.name = to.params.name
  next()
}
```

L'**interception de sortie** est habituellement utilisée pour empécher l'utilisateur de quitter la route sans avoir sauvegardé ses changements. La navigation peut être annulée en appelant `next(false)`.

```js
beforeRouteLeave (to, from , next) {
  const answer = window.confirm('Voulez-vous vraiment quitter cette page ? Vos changements seront perdus.')
  if (answer) {
    next()
  } else {
    next(false)
  }
}
```

## Le flux de résolution de navigation complet

1. La navigation est demandée.
2. Appel de l'interception de sortie des composants désactivés.
3. Appel des interceptions globales `beforeEach`.
4. Appel des interceptions `beforeRouteUpdate` pour les composants réutilisés.
5. Appel de `beforeEnter` dans la configuration de route.
6. Résolution des composants de route asynchrones.
7. Appel de `beforeRouteEnter` dans les composants activés.
8. Appel des interceptions `beforeResolve`.
9. Confirmation de la navigation.
10. Appel des hooks globaux `afterEach`.
11. Modification du DOM demandée.
12. Appel des fonctions de rappel passées à `next` dans l'interception `beforeRouteEnter` avec l'instance instanciée.
