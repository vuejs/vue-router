# Comportement du défilement

En utilisant le routage côté client, nous pourrions vouloir faire défiler la page jusqu'en haut lorsqu'on navigue vers une nouvelle route, ou alors préserver la position du défilement des entrées de l'historique comme le ferait une page réelle. `vue-router` vous permet de faire cela et, encore mieux, vous permet de changer le comportement du défilement pendant la navigation.

**Note : cette fonctionnalité ne fonctionne qu'avec le mode historique HTML5.**

Pendant la création de l'instance du routeur, vous pouvez renseigner la fonction `scrollBehavior` :

``` js
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // retourner la position désirée
  }
})
```

La fonction `scrollBehavior` reçoit les objets de route `to` et `from`. Le troisième argument, `savedPosition`, est disponible uniquement si c'est une navigation `popstate` (déclenchée par les boutons précédent/suivant du navigateur).

La fonction peut retourner un objet décrivant la position du défilement. L'objet peut être de la forme :

-  `{ x: number, y: number }`
- `{ selector: String }`

Si une valeur équivalente à `false` ou un objet vide est retourné, aucun défilement ne sera produit.

Par exemple : 

``` js
scrollBehavior (to, from, savedPosition) {
  return { x: 0, y: 0 }
}
```

Cela permettra de défiler au haut de page à chaque navigation à travers les routes.

Retourner l'objet `savedPosition` résultera en un comportement quasi-natif en naviguant avec les boutons précédents/suivants :

``` js
scrollBehavior (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}
```

Si vous voulez simuler le comportement « aller à l'ancre » :

``` js
scrollBehavior (to, from, savedPosition) {
  if (to.hash) {
    return {
      selector: to.hash
    }
  }
}
```

On peut aussi utiliser les [champs meta de route](meta.md) pour implémenter un contrôle bien précis pour le comportement du défilement. Allez voir un exemple complet [ici](https://github.com/vuejs/vue-router/blob/dev/examples/scroll-behavior/app.js).
