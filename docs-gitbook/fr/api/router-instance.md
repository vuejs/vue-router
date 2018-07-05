# L'instance du routeur

### Propriétés

#### router.app

- type: `instance de Vue`

 L'instance racine de Vue dans laquelle l'instance de `routeur` a été injectée.

#### router.mode

- type: `string`

  Le [mode](options.md#mode) que le routeur utilise.

#### router.currentRoute

- type: `Route`

  La route actuelle représentée en tant qu'un [objet route](route-object.md).

### Méthodes

- **router.beforeEach(guard)**
- **router.beforeResolve(guard)** (2.5.0+)
- **router.afterEach(hook)**

  Ajout des interceptions globales de navigation. Voir les [Intercepteurs de navigation](../advanced/navigation-guards.md).

  Dans la version 2.5.0+, ces trois méthodes retournent une fonction qui enlève les fonctions d'interception et hooks enregistrés.

- **router.push(location, onComplete?, onAbort?)**
- **router.replace(location, onComplete?, onAbort?)**
- **router.go(n)**
- **router.back()**
- **router.forward()**

  Navigue à une nouvelle URL de façon programmée. Voir [Navigation de façon programmée](../essentials/navigation.md).

- **router.getMatchedComponents(location?)**

  Retourne un tableau de composants (définition/constructeur et non les instances) correspondant à la `location` passée en paramètre, ou alors de la route actuelle. Cette fonction est principalement utilisée pendant le rendu côté serveur afin d'effectuer une prérécupération des données.

- **router.resolve(location, current?, append?)**

  > 2.1.0+

  Inverse la résolution d'URL. La `location` doit avoir la même forme qu'utilisée dans `<router-link>`, retourne un objet avec les propriétés suivantes :

  ``` js
  {
    location: Location;
    route: Route;
    href: string;
  }
  ```

  - `current` is the current Route by default (most of the time you don't need to change this)
  - `append` allows you to append the path to the `current` route (as with [`router-link`](router-link.md#props))

- **router.addRoutes(routes)**

  > 2.2.0+

  Permet d'ajouter dynamiquement des routes au routeur. L'argument doit être un tableau utilisant le même format de configuration que l'option `routes` du constructeur.

- **router.onReady(callback, [errorCallback])**

  > 2.2.0+

  Cette méthode met en file d'attente une fonction de rappel qui sera appelée lorsque le routeur aura complété la navigation initiale, ce qui signifie qu'il a résolu tous les hooks d'entrées asynchrones et composants asynchrones qui sont associés à la route initiale.

  C'est utile pendant un rendu côté serveur pour assurer une sortie consistance sur le serveur et le client.

  Le deuxième argument `errorCallback` est uniquement supporté à partir de la version 2.4. Il sera appelé lorsque la résolution de la route initiale résultera en une erreur (ex. : la résolution d'un composant asynchrone qui a échoué).

- **router.onError(callback)**

  > 2.4.0+

  Enregistre une fonction de rappel qui sera appelée lorsqu'une erreur sera capturée pendant la navigation vers une route. Notez que pour qu'une erreur soit appelée, cela doit correspondre à l'un des scénarios suivants :

  - L'erreur est lancée de manière synchrone à l'intérieur d'une fonction d'interception de route ;

  - L'erreur est capturée et traitée de manière asynchrone en appelant `next(err)` à l'intérieur d'une fonction d'interception de route ;

  - Une erreur est survenue pendant la résolution d'un composant asynchrone qui est requis pour faire le rendu d'une route.
