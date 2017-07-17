# Injections de composant

### Propriétés injectées

Ces propriétés sont injectées dans chacun des composants enfants, en passant l'instance du routeur à l'application racine de Vue en tant qu'option `router`.

- #### $router

  L'instance du routeur.

- #### $route

 La [Route](route-object.md) actuellement active. C'est une propriété en lecture seule et ses propriétés sont immutables, mais elles restent malgré tout observables.

### Options activées

- **beforeRouteEnter**
- **beforeRouteUpdate** (ajouté en 2.2)
- **beforeRouteLeave**

  Voir l'[interception par composant](../advanced/navigation-guards.md#securisation-par-composant).
