# Options de construction du routeur

### routes

- type: `Array<RouteConfig>`

  Déclaration de type pour `RouteConfig` :

  ``` js
  declare type RouteConfig = {
    path: string;
    component?: Component;
    name?: string; // pour les routes nommées
    components?: { [name: string]: Component }; // pour les vues nommées
    redirect?: string | Location | Function;
    props?: boolean | string | Function;
    alias?: string | Array<string>;
    children?: Array<RouteConfig>; // pour les routes imbriquées
    beforeEnter?: (to: Route, from: Route, next: Function) => void;
    meta?: any;
  }
  ```

### mode

- type : `string`

- défaut : `"hash" (dans le navigateur) | "abstract" (en Node.js)`

- valeurs disponibles : `"hash" | "history" | "abstract"`

  Configure le mode du routeur.

  - `hash` : utilise le hash de l'URL pour le routage. Fonctionne dans tous les navigateurs supportés par Vue, ainsi que ceux qui ne supportent pas l'API History d'HTML5.

  - `history` : nécessite l'API History d'HTML 5 et la configuration du serveur. Voir [Mode historique de HTML5](../essentials/history-mode.md).

  - `abstract` : fonctionne dans tous les environnements JavaScript, ex. côté serveur avec Node.js. **Le routeur sera automatiquement forcé d'utiliser ce mode si aucune API navigateur n'est présente.**

### base

- type : `string`

- défaut : `"/"`

  L'URL de base de l'application. Par exemple, si l'application monopage entière est distribuée sous `/app/`, alors `base` doit utiliser la valeur `"/app/"`.

### linkActiveClass

- type : `string`

- défaut : `"router-link-active"`

  Configure de manière globale la classe active par défaut de `<router-link>`. Voir aussi [router-link](router-link.md).

### linkExactActiveClass

> 2.5.0+

- type : `string`

- default : `"router-link-exact-active"`

  Configure de manière globale la classe active par défaut de `<router-link>` lors d'une correspondance exact. Voir aussi [router-link](router-link.md).

### scrollBehavior

- type : `Function`

  Signature :

  ```
  (
    to: Route,
    from: Route,
    savedPosition?: { x: number, y: number }
  ) => { x: number, y: number } | { selector: string } | ?{}
  ```

  Pour plus de détails, voir [Comportement du Scroll](../advanced/scroll-behavior.md).

### parseQuery / stringifyQuery

> 2.4.0+

- type : `Function`

  Permet de spécifier des fonctions personnalisées pour formater en objet ou en chaîne de caractères la requête. Surcharge les fonctions par défaut.
