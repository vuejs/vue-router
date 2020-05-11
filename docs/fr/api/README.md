---
sidebar: auto
---

# API

## `<router-link>`

`<router-link>` est le composant pour activer la navigation utilisateur dans une application où le routeur est activé. La localisation cible est spécifiée grâce à la prop `to`. Il est rendu en tant que balise `<a>` avec le `href` correct par défaut, mais peut être configuré grâce à la prop `tag`. De plus, le lien se verra attribuer une classe CSS active lorsque la route cible est active.

`<router-link>` est préféré par rapport au `<a href="...">` en dur dans le code pour les raisons suivantes :

- Cela fonctionne de la même manière qu'on soit dans le mode historique HTML5 ou le mode hash, donc si vous avez décidé de changer de mode, ou alors que le routeur se replie sur le mode hash pour IE9, rien n'a besoin d'être changé.

- Dans le mode historique HTML5, `router-link` interceptera l'évènement du clic, comme ça le navigateur n'essaiera pas de rafraichir la page.

- En utilisant l'option `base` dans le mode historique HTML5, vous n'avez pas besoin

### Appliquer la classe active à l'élément extérieur

Parfois, on voudrait que la classe active soit appliquée à un élément extérieur au lieu de l'élément `<a>` lui-même, dans ce cas, vous pouvez faire le rendu de cet élément extérieur en utilisant `<router-link>` et en entourant le tag `<a>` :

```html
<router-link tag="li" to="/foo">
  <a>/foo</a>
</router-link>
```

Dans ce cas, `<a>` sera le lien actuel (et récupèrera le bon `href`), mais la classe active sera appliquée à l'élément extérieur `<li>`.

## `<router-link>` Props

### to

- type : `string | Location`
- requis

  Désigne la route cible du lien. Lorsqu'il est cliqué, la valeur de la prop `to` va être passée de manière interne à `router.push`, donc la valeur peut soit être une chaine de caractères, ou alors un objet décrivant une localisation.

  ```html
  <!--  chaine littérale  -->
  <router-link to="home">Accueil</router-link>
  <!-- rend -->
  <a href="home">Accueil</a>

  <!-- expression JavaScript en utilisant `v-bind` -->
  <router-link v-bind:to="'home'">Accueil</router-link>

  <!-- Omettre `v-bind` est OK, tout comme une autre prop -->
  <router-link :to="'home'">Accueil</router-link>

  <!-- pareil qu'au-dessus -->
  <router-link :to="{ path: 'home' }">Accueil</router-link>

  <!-- route nommée -->
  <router-link :to="{ name: 'user', params: { userId: 123 }}"
    >Utilisateur</router-link
  >

  <!-- avec une requête, résulte en `/register?plan=private` -->
  <router-link :to="{ path: 'register', query: { plan: 'private' }}"
    >S'enregistrer</router-link
  >
  ```

### replace

- type : `boolean`
- défaut : `false`

  Configurer la prop `replace` appellera `router.replace()` au lieu de `router.push()` lors du clic, comme ça, la navigation ne laissera pas un enregistrement dans l'historique.

  ```html
  <router-link :to="{ path: '/abc'}" replace></router-link>
  ```

### append

- type : `boolean`
- défaut : `false`

  Configurer la propriété `append` suffixe toujours le chemin relatif au chemin courant. Par exemple, assumons que nous naviguons de `/a` à un lien relatif `b`, sans `append` on finira sur `/b`, mais avec `append` on finira sur `/a/b`.

  ```html
  <router-link :to="{ path: 'relative/path'}" append></router-link>
  ```

### tag

- type : `string`
- défaut : `"a"`

  Parfois, on veut que `<router-link>` soit rendu avec une balise différente, ex : `<li>`. On peut alors utiliser la prop `tag` pour modifier la balise qui sera rendue, et elle écoutera toujours les évènements de clic pour la navigation.

  ```html
  <router-link to="/foo" tag="li">foo</router-link>
  <!-- rend -->
  <li>foo</li>
  ```

### active-class

- type : `string`
- défaut : `"router-link-active"`

  Configure la classe CSS active qui sera appliquée lorsque le lien sera actif. Notez que la valeur par défaut peut aussi être configurée de manière globale via l'option `linkActiveClass` du constructeur du routeur.

### exact

- type : `boolean`
- défaut : `false`

Le comportement par défaut de la correspondance de classe active est une **correspondance inclusive**. Par exemple, `<router-link to="/a">` verra cette classe appliquée tant que le chemin courant commencera par `/a/` ou `/a`.

Une conséquence de cela est que `<router-link to="/">` sera actif pour toutes les routes ! Pour forcer le lien dans un « mode correspondance exacte », utilisez la prop `exact`.

```html
<!-- ce lien sera uniquement actif à `/` -->
<router-link to="/" exact></router-link>
```

Allez voir les exemples expliquant la classe active pour les liens [ici](https://jsfiddle.net/8xrk1n9f/).

### event

- type : `string | Array<string>`
- défaut : `'click'`

  Spécifie les évènement(s) que peu(ven)t lancer la navigation de lien.

### exact-active-class

- type : `string`
- défaut : `"router-link-exact-active"`

  Configure la classe CSS active qui sera appliquée lorsqu'un lien sera actif avec une correspondance exacte. Notez que la valeur par défaut peut aussi être configurée de manière globale via l'option `linkExactActiveClass` du constructeur du routeur.

## `<router-view>`

Le composant `<router-view>` est un composant fonctionnel qui fait le rendu du composant correspondant au chemin donné. Les composants rendus dans `<router-view>` peuvent aussi contenir leur propre `<router-view>`, qui fera le rendu des composants pour les chemins imbriqués.

## `<router-view>` Props

### name

- type : `string`
- défaut : `"default"`

  Lorsqu'un `<router-view>` a un nom, il fera le rendu du composant correspondant à ce nom dans les itinéraires de route correspondant à l'option `components`. Voir les [Routes nommées](../guide/essentials/named-views.md) pour un exemple.

## Options de construction du routeur

### routes

- type: `Array<RouteConfig>`

  Déclaration de type pour `RouteConfig` :

  ```js
  declare type RouteConfig = {
    path: string,
    component?: Component,
    name?: string, // pour les routes nommées
    components?: { [name: string]: Component }, // pour les vues nommées
    redirect?: string | Location | Function,
    props?: boolean | string | Function,
    alias?: string | Array<string>,
    children?: Array<RouteConfig>, // pour les routes imbriquées
    beforeEnter?: (to: Route, from: Route, next: Function) => void,
    meta?: any,

    // 2.6.0+
    caseSensitive?: boolean, // use case sensitive match? (default: false)
    pathToRegexpOptions?: Object // path-to-regexp options for compiling regex
  }
  ```

### mode

- type : `string`

- défaut : `"hash" (dans le navigateur) | "abstract" (en Node.js)`

- valeurs disponibles : `"hash" | "history" | "abstract"`

  Configure le mode du routeur.

  - `hash` : utilise le hash de l'URL pour le routage. Fonctionne dans tous les navigateurs supportés par Vue, ainsi que ceux qui ne supportent pas l'API History d'HTML5.

  - `history` : nécessite l'API History d'HTML 5 et la configuration du serveur. Voir [Mode historique de HTML5](../guide/essentials/history-mode.md).

  - `abstract` : fonctionne dans tous les environnements JavaScript, ex. côté serveur avec Node.js. **Le routeur sera automatiquement forcé d'utiliser ce mode si aucune API navigateur n'est présente.**

### base

- type : `string`

- défaut : `"/"`

  L'URL de base de l'application. Par exemple, si l'application monopage entière est distribuée sous `/app/`, alors `base` doit utiliser la valeur `"/app/"`.

### linkActiveClass

- type : `string`

- défaut : `"router-link-active"`

  Configure de manière globale la classe active par défaut de `<router-link>`. Voir aussi [router-link](./#router-link).

### linkExactActiveClass

- type : `string`

- default : `"router-link-exact-active"`

  Configure de manière globale la classe active par défaut de `<router-link>` lors d'une correspondance exacte. Voir aussi [router-link](./#router-link).

### scrollBehavior

- type : `Function`

  Signature :

  ```
  type PositionDescriptor =
    { x: number, y: number } |
    { selector: string } |
    ?{}

  type scrollBehaviorHandler = (
    to: Route,
    from: Route,
    savedPosition?: { x: number, y: number }
  ) => PositionDescriptor | Promise<PositionDescriptor>
  ```

  Pour plus de détails, voir [Comportement du Scroll](../guide/advanced/scroll-behavior.md).

### parseQuery / stringifyQuery

- type : `Function`

  Permettent de spécifier des fonctions personnalisées pour formater en objet ou en chaîne de caractères la requête. Surcharge les fonctions par défaut.

### fallback

- type : `boolean`

  Contrôle comment le routeur devrait passer en mode `hash` quand le navigateur ne supporte pas `history.pushState`. Par défaut à `true`.

  Passer cette valeur à `false` va essentiellement faire que la navigation via `router-link` va réclamer un rechargement de page dans IE9. Ceci est utile quand l'application est rendue côté serveur et à besoin de fonctionner dans IE9, car le mode hash ne fonctionne pas avec du SSR.

## L'instance du routeur

### router.app

- type: `instance de Vue`

L'instance racine de Vue dans laquelle l'instance de `routeur` a été injectée.

### router.mode

- type: `string`

  Le [mode](./#mode) que le routeur utilise.

### router.currentRoute

- type: `Route`

  La route actuelle représentée en tant qu'un [objet route](./#proprietes-de-l-objet-route).

## Méthodes

### router.beforeEach

### router.beforeResolve

### router.afterEach

Ajout des interceptions globales de navigation. Voir les [Intercepteurs de navigation](../guide/advanced/navigation-guards.md).

Dans la version 2.5.0+, ces trois méthodes retournent une fonction qui enlève les fonctions d'interception et hooks enregistrés.

### router.push

### router.replace

### router.go

### router.back

### router.forward

Navigue à une nouvelle URL de façon programmée. Voir [Navigation de façon programmée](../guide/essentials/navigation.md).

### router.getMatchedComponents

Retourne un tableau de composants (définition/constructeur et non les instances) correspondant à la `location` passée en paramètre, ou alors de la route actuelle. Cette fonction est principalement utilisée pendant le rendu côté serveur afin d'effectuer une prérécupération des données.

### router.resolve

Inverse la résolution d'URL. La `location` doit avoir la même forme qu'utilisée dans `<router-link>`, retourne un objet avec les propriétés suivantes :

```js
{
  location: Location
  route: Route
  href: string
}
```

- `current` is the current Route by default (most of the time you don't need to change this)
- `append` allows you to append the path to the `current` route (as with [`router-link`](./#router-link-props))

### router.addRoutes

Permet d'ajouter dynamiquement des routes au routeur. L'argument doit être un tableau utilisant le même format de configuration que l'option `routes` du constructeur.

### router.onReady

Cette méthode met en file d'attente une fonction de rappel qui sera appelée lorsque le routeur aura complété la navigation initiale, ce qui signifie qu'il a résolu tous les hooks d'entrées asynchrones et composants asynchrones qui sont associés à la route initiale.

C'est utile pendant un rendu côté serveur pour assurer une sortie consistance sur le serveur et le client.

Le deuxième argument `errorCallback` est uniquement supporté à partir de la version 2.4. Il sera appelé lorsque la résolution de la route initiale résultera en une erreur (ex. : la résolution d'un composant asynchrone qui a échoué).

### router.onError

Enregistre une fonction de rappel qui sera appelée lorsqu'une erreur sera capturée pendant la navigation vers une route. Notez que pour qu'une erreur soit appelée, cela doit correspondre à l'un des scénarios suivants :

- L'erreur est lancée de manière synchrone à l'intérieur d'une fonction d'interception de route ;

- L'erreur est capturée et traitée de manière asynchrone en appelant `next(err)` à l'intérieur d'une fonction d'interception de route ;

- Une erreur est survenue pendant la résolution d'un composant asynchrone qui est requis pour faire le rendu d'une route.

# L'objet `Route`

Un **objet `Route`** représente l'état actuel de la route active. Il contient des informations analysées à propos de l'URL courant et **les itinéraires de route** appariés par l'URL.

L'objet `Route` est immutable. Chaque navigation qui se déroule avec succès résultera en un nouvel objet `Route`.

L'objet `Route` peut être trouvé à plusieurs endroits :

- À l'intérieur des composants en tant que `this.$route`

- À l'intérieur des fonctions de rappel des observateurs de `$route`

- Comme valeur de retour après l'appel de `router.match(location)`

- À l'intérieur des fonctions d'interception de la navigation, dans les deux premiers paramètres de la fonction :

  ```js
  router.beforeEach((to, from, next) => {
    // `to` et `from` sont tous les deux des objets Route
  })
  ```

- À l'intérieur de la fonction `scrollBehavior` dans les deux premiers arguments :

  ```js
  const router = new VueRouter({
    scrollBehavior(to, from, savedPosition) {
      // `to` et `from` sont tous les deux des objets Route
    }
  })
  ```

### Propriétés de l'objet `Route`

- **\$route.path**

  - type : `string`

    Une chaine de caractères représentant le chemin de la route en cours, toujours résolue en tant que chemin absolu, ex : `"/foo/bar"`.

- **\$route.params**

  - type : `Object`

    Un objet qui contient des pairs clé/valeur de segments dynamiques et segments _star_. S'il n'y a pas de paramètres, alors la valeur sera un objet vide.

- **\$route.query**

  - type : `Object`

    Un objet qui contient des pairs clé/valeur de la requête au format d'une chaine de caractères. Par exemple, pour un chemin `/foo?user=1`, on aura `$route.query.user == 1`. S'il n'y a pas de requête, alors la valeur sera un objet vide.

- **\$route.hash**

  - type : `string`

    Le hash de la route courante (avec le `#`), s'il y en a un. S'il n'y a pas de hash, alors la valeur sera une chaine de caractères vide.

- **\$route.fullPath**

  - type : `string`

    L'URL entièrement résolu, incluant la requête et le hash.

- **\$route.matched**

  - type : `Array<RouteRecord>`

    Un `Array` contenant les **les itinéraires de la route** pour chaque segment de chemin imbriqué de la route courante. Les itinéraires de la route sont des copies des objets dans le tableau de configuration `routes` (et dans les tableaux `children`).

  ```js
  const router = new VueRouter({
    routes: [
      // l'objet qui suit est un itinéraire de route
      {
        path: '/foo',
        component: Foo,
        children: [
          // c'est aussi un itinéraire
          { path: 'bar', component: Bar }
        ]
      }
    ]
  })
  ```

  Lorsque l'URL sera `/foo/bar`, `$route.matched` sera un `Array` contenant les deux objets (clonés), dans l'ordre parent à l'enfant.

- **\$route.name**

  Le nom de la route courante, si elle en a un. (Voir [Routes nommées](../guide/essentials/named-routes.md)).

- **\$route.redirectedFrom**

  Le nom de la route d'où la page a été redirigée, si elle en a un. (Voir [Redirection et alias](../guide/essentials/redirect-and-alias.md)).

## Injections de composant

### Propriétés injectées

Ces propriétés sont injectées dans chacun des composants enfants, en passant l'instance du routeur à l'application racine de Vue en tant qu'option `router`.

- **\$router**

  L'instance du routeur.

- **\$route**

La [Route](./#proprietes-de-l-objet-route) actuellement active. C'est une propriété en lecture seule et ses propriétés sont immutables, mais elles restent malgré tout observables.

### Options activées

- **beforeRouteEnter**
- **beforeRouteUpdate** (ajouté en 2.2)
- **beforeRouteLeave**

  Voir l'[interception par composant](../guide/advanced/navigation-guards.md#securisation-par-composant).
