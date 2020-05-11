# Concordance dynamique de route

Vous allez très souvent associer des routes avec un motif donné à un même composant. Par exemple nous pourrions avoir le composant `User` qui devrait être rendu pour tous les utilisateurs mais avec différents identifiants. Avec `vue-router` nous pouvons utiliser des segments dynamiques dans le chemin de la route pour réaliser cela :

``` js
const User = {
  template: '<div>Utilisateur</div>'
}

const router = new VueRouter({
  routes: [
    // Les segments dynamiques commencent avec la ponctuation deux-points
    { path: '/utilisateur/:id', component: User }
  ]
})
```

Maintenant des URL comme `/utilisateur/foo` et `/utilisateur/bar` seront chacun associé à la même route.

Un segment dynamique se repère avec les deux-points `:`. Quand une route concorde, la valeur du segment dynamique est exposée via `this.$route.params` dans tous les composants. Et donc, nous pouvons faire le rendu de l'identifiant de l'utilisateur courant en mettant à jour le template de `User` ainsi :

``` js
const User = {
  template: '<div>Utilisateur {{ $route.params.id }}</div>'
}
```

Vous pouvez regarder un exemple en ligne [ici](https://jsfiddle.net/yyx990803/4xfa2f19/).

Vous pouvez avoir plusieurs segments dynamiques pour une même route, et ils seront associés aux champs associés dans `$route.params`. Des exemples :

| motif | chemin concordant | $route.params |
|---------|------|--------|
| /utilisateur/:username | /utilisateur/evan | `{ username: 'evan' }` |
| /utilisateur/:username/billet/:post_id | /utilisateur/evan/billet/123 | `{ username: 'evan', post_id: 123 }` |

En plus de `$route.params`, l'objet `$route` expose également d'autres informations utiles comme la `$route.query` (s'il y a une requête dans l'URL), `$route.hash`, etc. Vous pouvez accéder à tous les détails de cela dans la [référence de l'API](../../api/#the-route-object).

## Réactivité aux changements de paramètres

Une chose à noter quand vous utilisez des routes avec des paramètres (segments), c'est que lors de la navigation de l'utilisateur de `/utilisateur/foo` vers `/utilisateur/bar`, **la même instance de composant va être réutilisée**. Puisque les deux routes font le rendu du même composant, cela est plus performant que de détruire l'ancienne instance et d'en créer une nouvelle. **Cependant, cela signifie également que les hooks de cycle de vie ne seront pas appelés**.

Pour réagir aux changements de paramètres dans le même composant, vous pouvez simplement observer l'objet `$route` :

``` js
const User = {
  template: '...',
  watch: {
    '$route' (to, from) {
      // réagir au changement de route...
    }
  }
}
```

Ou utiliser la [fonction d'interception](../advanced/navigation-guards.html) `beforeRouteUpdate` introduite avec la 2.2 :

``` js
const User = {
  template: '...',
  beforeRouteUpdate (to, from, next) {
    // réagir au changement de route...
    // n'oubliez pas d'appeler `next()`
  }
}
```

## Motifs de concordance avancés

`vue-router` utilise [path-to-regexp](https://github.com/pillarjs/path-to-regexp/tree/v1.7.0) comme moteur de concordance de chemin, il supporte donc plusieurs motifs de concordance avancés tels que la présence optionnelle de segments dynamiques, aucun ou plusieurs motifs, plus d'options par motifs, et même des motifs d'expressions régulières personnalisés. Consultez cette [documentation](https://github.com/pillarjs/path-to-regexp/tree/v1.7.0#parameters) pour utiliser ces motifs avancés et [cet exemple](https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js) pour les utiliser avec `vue-router`.

## Priorité de concordance

Parfois la même URL peut être adressé par de multiples routes. Dans ce cas, la priorité de concordance est déterminée par l'ordre de la définition des routes : plus la route est définie tôt, plus sa priorité est élevée.
