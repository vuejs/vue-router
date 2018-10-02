---
sidebarDepth: 0
---

# Navigation programmatique

En complément du l'utilisation de `<router-link>` pour créer des balises ancres pour la navigation déclarative, nous pouvons le faire de manière programmatique en utilisant les méthodes de l'instance du routeur.

#### `router.push(location, onComplete?, onAbort?)`

**Note : Dans une instance Vue, vous pouvez accéder à l'instance du routeur via `$router`. Vous pouvez donc appeler `this.$router.push`.**

Pour naviguer vers un URL différent, utilisez `router.push`. Cette méthode ajoute une nouvelle entrée dans la pile de l'historique. Ainsi quand un utilisateur clique sur le bouton retour de son navigateur, il retournera à l'URL précédent.

Cette méthode est appelée en interne quand vous cliquez sur `<router-link>`, donc cliquer sur `<router-link :to="...">` est équivalent à appeler `router.push(...)`.

| Déclarative | Programmatique |
|-------------|--------------|
| `<router-link :to="...">` | `router.push(...)` |

L'argument peut être une chaine de caractère représentant un chemin, ou un objet de description de destination. Des exemples :

``` js
// chaine de caractère représentant un chemin
router.push('home')

// objet
router.push({ path: 'home' })

// route nommée
router.push({ name: 'user', params: { userId: 123 }})

// avec une requête « query » résultant de `/register?plan=private`
router.push({ path: 'register', query: { plan: 'private' }})
```

**Note :** `params` est ignoré si `path` est fourni, ce qui n'est pas le cas pour `query`, comme démontré dans l'exemple ci-dessous. À la place, vous devez fournir le `name` de la route ou manuellement spécifier le `path` complet avec tous les paramètres :

```js
const userId = 123
router.push({ name: 'user', params: { userId }}) // -> /user/123
router.push({ path: `/user/${userId}` }) // -> /user/123
// Ceci ne va PAS fonctionner
router.push({ path: '/user', params: { userId }}) // -> /user
```

Les mêmes règles s'appliquent pour la propriété `to` du composant `router-link`.

Dans la version 2.2.0+, vous pouvez optionnellement fournir les fonctions de rappel `onComplete` et `onAbort` à `router.push` ou `router.replace` en tant que deuxième et troisième arguments. Ces fonctions de rappel seront appelées quand la navigation sera respectivement ; complétée avec succès (après la résolution de tous les hooks asynchrones), ou arrêtée (navigation vers la même route ou vers une route différente avant que la navigation courante ne soit achevée).

**Note :** si la destination est la même que la route courante et que seuls les paramètres ont changés (par ex. naviguer d'un profil à l'autre `/utilisateurs/1` -> `/utilisateurs/2`), vous devrez utiliser [`beforeRouteUpdate`](./dynamic-matching.md#réactivité-aux-changements-de-paramètres) pour réagir aux changements (par ex. récupérer les informations de l'utilisateur).

## `router.replace(location, onComplete?, onAbort?)`

Il agit comme `router.push`. La seule différence est que la navigation se fait sans ajouter de nouvelle entrée dans la pile de l'historique. Comme son nom l'indique, il remplace l'entrée courante.

| Déclarative | Programmatique |
|-------------|--------------|
| `<router-link :to="..." replace>` | `router.replace(...)` |


## `router.go(n)`

Cette méthode prend un seul nombre en tant que paramètre. Celui-ci indique de combien d'entrées vers l'avant ou vers l'arrière il faut naviguer dans la pile de l'historique, de la même manière qu'avec `window.history.go(n)`.

Des exemples

``` js
// avancer d'une entrée, identique à `history.forward()`
router.go(1)

// retourner d'une entrée en arrière, identique à `history.back()`
router.go(-1)

// avancer de trois entrées
router.go(3)

// échoue silencieusement s'il n'y a pas assez d'entrées.
router.go(-100)
router.go(100)
```

## Manipulation de l'historique

Vous avez peut être remarqué que `router.push`, `router.replace` et `router.go` sont des équivalents de [`window.history.pushState`, `window.history.replaceState` et `window.history.go`](https://developer.mozilla.org/fr-FR/docs/Web/API/History), et qu'ils imitent les APIs de `window.history`.

Donc, si vous utilisez déjà l'[API History des navigateurs](https://developer.mozilla.org/fr-FR/docs/Web/API/History_API), manipuler l'historique sera très simple avec vue-router.

Il n'est pas nécessaire de préciser que les méthodes de navigation (`push`, `replace`, `go`) fonctionnent de la même manière dans tous les modes de routage (`history`, `hash` et `abstract`).
