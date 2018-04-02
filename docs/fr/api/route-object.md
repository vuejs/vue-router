# L'objet `Route`

Un **objet `Route`** représente l'état actuel de la route active. Il contient des informations analysées à propos de l'URL courant et **les itinéraires de route** appariés par l'URL.

L'objet `Route` est immutable. Chaque navigation qui se déroule avec succès résultera en un nouvel objet `Route`.

L'objet `Route` peut être trouvé à plusieurs endroits :

- À l'intérieur des composants en tant que `this.$route`

- À l'intérieur des fonctions de rappel des observateurs de `$route`

- Comme valeur de retour après l'appel de `router.match(location)`

- À l'intérieur des fonctions d'interception de la navigation, dans les deux premiers paramètres de la fonction :

  ``` js
  router.beforeEach((to, from, next) => {
    // `to` et `from` sont tous les deux des objets Route
  })
  ```

- À l'intérieur de la fonction `scrollBehavior` dans les deux premiers arguments :

  ``` js
  const router = new VueRouter({
    scrollBehavior (to, from, savedPosition) {
      // `to` et `from` sont tous les deux des objets Route
    }
  })
  ```

### Propriétés de l'objet `Route`

- **$route.path**

  - type : `string`

    Une chaine de caractères représentant le chemin de la route en cours, toujours résolue en tant que chemin absolu, ex : `"/foo/bar"`.

- **$route.params**

  - type : `Object`

    Un objet qui contient des pairs clé/valeur de segments dynamiques et segments *star*. S'il n'y a pas de paramètres, alors la valeur sera un objet vide.

- **$route.query**

  - type : `Object`

    Un objet qui contient des pairs clé/valeur de la requête au format d'une chaine de caractères. Par exemple, pour un chemin `/foo?user=1`, on aura `$route.query.user == 1`. S'il n'y a pas de requête, alors la valeur sera un objet vide.

- **$route.hash**

  - type : `string`

    Le hash de la route courante (avec le `#`), s'il y en a un. S'il n'y a pas de hash, alors la valeur sera une chaine de caractères vide.

- **$route.fullPath**

  - type : `string`

    L'URL entièrement résolu, incluant la requête et le hash.

- **$route.matched**

  - type : `Array<RouteRecord>`

    Un `Array` contenant les **les itinéraires de la route** pour chaque segment de chemin imbriqué de la route courante. Les itinéraires de la route sont des copies des objets dans le tableau de configuration `routes` (et dans les tableaux `children`).

  ``` js
  const router = new VueRouter({
    routes: [
      // l'objet qui suit est un itinéraire de route
      { path: '/foo', component: Foo,
        children: [
          // c'est aussi un itinéraire
          { path: 'bar', component: Bar }
        ]
      }
    ]
  })
  ```

  Lorsque l'URL sera `/foo/bar`, `$route.matched` sera un `Array` contenant les deux objets (clonés), dans l'ordre parent à l'enfant.

- **$route.name**

  Le nom de la route courante, si elle en a un. (Voir [Routes nommées](../essentials/named-routes.md)).

- **$route.redirectedFrom**

  Le nom de la route d'où la page a été redirigée, si elle en a un. (Voir [Redirection et alias](../essentials/redirect-and-alias.md)).
