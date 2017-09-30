# `<router-view>`

Le composant `<router-view>` est un composant fonctionnel qui fait le rendu du composant correspondant au chemin donné. Les composants rendus dans `<router-view>` peuvent aussi contenir leur propre `<router-view>`, qui fera le rendu des composants pour les chemins imbriqués.

### Props

- **name**

  - type : `string`

  - défaut : `"default"`

  Lorsqu'un `<router-view>` a un nom, il fera le rendu du composant correspondant à ce nom dans les itinéraires de route correspondant à l'option `components`. Voir les [Routes nommées](../essentials/named-views.md) pour un exemple.

### Comportement

Les propriétés sans nom seront passées le long du composant rendu, toutefois la plupart du temps, les données par route seront contenues dans les paramètres de la route.

Car c'est juste un composant, il fonctionne avec `<transition>` et `<keep-alive>`. Lorsque vous utilisez les deux ensemble, soyez sûr d'utiliser `<keep-alive> à l'intérieur :

``` html
<transition>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</transition>
```
