# `<router-link>`

`<router-link>` est le composant pour activer la navigation utilisateur dans une application où le routeur est activé. La localisation cible est spécifiée grâce à la prop `to`. Il est rendu en tant que balise `<a>` avec le `href` correct par défaut, mais peut être configuré grâce à la prop `tag`. De plus, le lien se verra attribuer une classe CSS active lorsque la route cible est active.

`<router-link>` est préféré par rapport au `<a href="...">` en dur dans le code pour les raisons suivantes :

- Cela fonctionne de la même manière qu'on soit dans le mode historique HTML5 ou le mode hash, donc si vous avez décidé de changer de mode, ou alors que le routeur se replie sur le mode hash pour IE9, rien n'a besoin d'être changé.

- Dans le mode historique HTML5, `router-link` interceptera l'évènement du clic, comme ça le navigateur n'essaiera pas de rafraichir la page.

- En utilisant l'option `base` dans le mode historique HTML5, vous n'avez pas besoin de l'inclure dans les props `to` des URL.

### Props

- **to**

  - type : `string | Location`

  - requis

   Désigne la route cible du lien. Lorsqu'il est cliqué, la valeur de la prop `to` va être passée de manière interne à `router.push`, donc la valeur peut soit être une chaine de caractères, ou alors un objet décrivant une localisation.

  ``` html
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
  <router-link :to="{ name: 'user', params: { userId: 123 }}">Utilisateur</router-link>

  <!-- avec une requête, résulte en `/register?plan=private` -->
  <router-link :to="{ path: 'register', query: { plan: 'private' }}">S'enregistrer</router-link>
  ```


- **replace**

  - type : `boolean`

  - défaut : `false`

  Configurer la prop `replace` appellera `router.replace()` au lieu de `router.push()` lors du clic, comme ça, la navigation ne laissera pas un enregistrement dans l'historique.

  ``` html
  <router-link :to="{ path: '/abc'}" replace></router-link>
  ```


- **append**

  - type : `boolean`

  - défaut : `false`

  Configurer la propriété `append` suffixe toujours le chemin relatif au chemin courant. Par exemple, assumons que nous naviguons de `/a` à un lien relatif `b`, sans `append` on finira sur `/b`, mais avec `append` on finira sur `/a/b`.

  ``` html
  <router-link :to="{ path: 'relative/path'}" append></router-link>
  ```


- **tag**

  - type : `string`

  - défaut : `"a"`

  Parfois, on veut que `<router-link>` soit rendu avec une balise différente, ex : `<li>`. On peut alors utiliser la prop `tag` pour modifier la balise qui sera rendue, et elle écoutera toujours les évènements de clic pour la navigation.

  ``` html
  <router-link to="/foo" tag="li">foo</router-link>
  <!-- rend -->
  <li>foo</li>
  ```


- **active-class**

  - type : `string`

  - défaut : `"router-link-active"`

  Configure la classe CSS active qui sera appliquée lorsque le lien sera actif. Notez que la valeur par défaut peut aussi être configurée de manière globale via l'option `linkActiveClass` du constructeur du routeur.

- **exact**

  - type : `boolean`

  - défaut : `false`

  Le comportement par défaut de la correspondance de classe active est une **correspondance inclusive**. Par exemple, `<router-link to="/a">` verra cette classe appliquée tant que le chemin courant commencera par `/a/` ou `/a`.

  Une conséquence de cela est que `<router-link to="/">` sera actif pour toutes les routes ! Pour forcer le lien dans un « mode correspondance exacte », utilisez la prop `exact`.

  ``` html
  <!-- ce lien sera uniquement actif à `/` -->
  <router-link to="/" exact>
  ```

  Allez voir les exemples expliquant la classe active pour les liens [ici](https://jsfiddle.net/8xrk1n9f/).

- **event**

  > 2.1.0+

  - type : `string | Array<string>`

  - défaut : `'click'`

  Spécifie les évènement(s) que peu(ven)t lancer la navigation de lien.

- **exact-active-class**

  > 2.5.0+

  - type : `string`

  - défaut : `"router-link-exact-active"`

  Configure la classe CSS active qui sera appliquée lorsqu'un lien sera actif avec une correspondance exacte. Notez que la valeur par défaut peut aussi être configurée de manière globale via l'option `linkExactActiveClass` du constructeur du routeur.

### Appliquer la classe active à l'élément extérieur

Parfois, on voudrait que la classe active soit appliquée à un élément extérieur au lieu de l'élément `<a>` lui-même, dans ce cas, vous pouvez faire le rendu de cet élément extérieur en utilisant `<router-link>` et en entourant le tag `<a>` :

``` html
<router-link tag="li" to="/foo">
  <a>/foo</a>
</router-link>
```

Dans ce cas, `<a>` sera le lien actuel (et récupèrera le bon `href`), mais la classe active sera appliquée à l'élément extérieur `<li>`.
