# Vues nommées

Parfois vous avez besoin d'afficher différentes vues en même temps plutôt que de les imbriquer, c.-à-d. créer un affichage avec une vue `sidebar` et une vue `main` par exemple. C'est ici que les routes nommées entrent en jeu. Au lieu d'avoir une seule balise de vue, vous pouvez en avoir une multitude et donner à chacune d'entre elles un nom. Un `router-view` sans nom aura comme nom par défaut : `default`.

``` html
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
```

Une vue est rendue en utilisant un composant, donc de multiples vues nécessitent de multiples composants pour une même route. Assurez-vous d'utiliser l'option `components` (avec un s) :

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    }
  ]
})
```

Une démo de cet exemple peut-être trouvée [ici](https://jsfiddle.net/posva/6du90epg/).

## Vues nommées imbriquées

Il est possible de créer des dispositions complexes en utilisant les vues nommées avec les vues imbriquées. Quand vous le faites, vous devez nommer les composants imbriqués de `router-view` utilisés. Voyons cela avec un panneau de configuration exemple :

```
/parametres/emails                                     /parametres/profile
+-----------------------------------+                  +------------------------------+
| UserSettings                      |                  | UserSettings                 |
| +-----+-------------------------+ |                  | +-----+--------------------+ |
| | Nav | UserEmailsSubscriptions | |  +------------>  | | Nav | UserProfile        | |
| |     +-------------------------+ |                  | |     +--------------------+ |
| |     |                         | |                  | |     | UserProfilePreview | |
| +-----+-------------------------+ |                  | +-----+--------------------+ |
+-----------------------------------+                  +------------------------------+
```

- `Nav` est juste un composant standard.
- `UserSettings` est un composant de vue.
- `UserEmailsSubscriptions`, `UserProfile`, `UserProfilePreview` sont des composants de vue imbriqués.

**Note** : _mettons de côté la partie HTML / CSS de cette disposition et concentrons nous sur le composant utilisé en lui-même._

La section `<template>` pour le composant `UserSettings` de la disposition ci-dessus devrait ressembler à quelque chose comme cela :

```html
<!-- UserSettings.vue -->
<div>
  <h1>Paramètres utilisateurs</h1>
  <NavBar/>
  <router-view/>
  <router-view name="helper"/>
</div>
```

_Le composant de vue imbriqué est omis ici mais vous pouvez le trouver dans le code source complet de l'exemple ci-dessus [ici](https://jsfiddle.net/posva/22wgksa3/)._

Puis vous pouvez achever la disposition ci-dessus avec la configuration de route :

```js
{
  path: '/parametres',
  // Vous pouvez également avoir des vues nommées à la racine
  component: UserSettings,
  children: [{
    path: 'emails',
    component: UserEmailsSubscriptions
  }, {
    path: 'profile',
    components: {
      default: UserProfile,
      helper: UserProfilePreview
    }
  }]
}
```

Une démo de cet exemple peut-être trouvée [ici](https://jsfiddle.net/posva/22wgksa3/).
