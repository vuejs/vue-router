# Routes imbriquées

Les vraies interfaces utilisateurs d'application sont faites de composants imbriqués à de multiples niveaux de profondeur. Il est aussi très commun que les segments d'URL correspondent à une certaine structure de composants imbriqués, par exemple :

```
/utilisateur/foo/profil                  /utilisateur/foo/billets
+---------------------+                  +--------------------+
| User                |                  | User               |
| +-----------------+ |                  | +----------------+ |
| | Profile         | |  +------------>  | | Posts          | |
| |                 | |                  | |                | |
| +-----------------+ |                  | +----------------+ |
+---------------------+                  +--------------------+
```

Avec `vue-router`, il est vraiment très simple d'exprimer cette relation en utilisant des configurations de route imbriquées.

Reprenons l'application créée au chapitre précédent :

``` html
<div id="app">
  <router-view></router-view>
</div>
```

``` js
const User = {
  template: '<div>Utilisateur {{ $route.params.id }}</div>'
}

const router = new VueRouter({
  routes: [
    { path: '/utilisateur/:id', component: User }
  ]
})
```

Ici le `<router-view>` est une balise de premier niveau. Il fait le rendu des composants qui concordent avec une route de premier niveau. De la même façon, un composant de rendu peut contenir également sa propre balise `<router-view>` imbriquée. Par exemple, ajoutons en une à l'intérieur du template du composant `User` :

``` js
const User = {
  template: `
    <div class="user">
      <h2>Utilisateur {{ $route.params.id }}</h2>
      <router-view></router-view>
    </div>
  `
}
```

Pour faire le rendu de composants à l'intérieur des balises imbriquées, nous avons besoin d'utiliser l'option `children` dans la configuration du constructeur de `VueRouter` :

``` js
const router = new VueRouter({
  routes: [
    { path: '/utilisateur/:id', component: User,
      children: [
        {
          // `UserProfile` va être rendu à l'intérieur du `<router-view>` de `User`
          // quand `/utilisateur/:id/profil` concorde
          path: 'profil',
          component: UserProfile
        },
        {
          // `UserPosts` va être rendu à l'intérieur du `<router-view>` de `User`
          // quand `/utilisateur/:id/billets` concorde
          path: 'billets',
          component: UserPosts
        }
      ]
    }
  ]
})
```

**Notez que les chemins imbriqués commençants par `/` vont être traités comme des chemins partant de la racine. Cela vous permet d'adresser des composants imbriqués sans avoir à utiliser un URL imbriqué.**

Comme vous pouvez le voir, l'option `children` n'est qu'un autre tableau d'objet de configuration de route comme dans `routes`. Et donc, vous pouvez garder les vues imbriquées au plus près de vos besoins.

À ce niveau, avec la configuration ci-dessus, quand vous visitez `/utilisateur/foo`, rien ne sera rendu dans la partie `User`, car aucune sous route ne concorde. Peut-être voudriez-vous afficher quelque chose ici. Dans ce cas, vous pouvez fournir une sous route vide :

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/utilisateur/:id', component: User,
      children: [
        // `UserHome` va être rendu à l'intérieur du `<router-view>` de `User`
        // quand `/utilisateur/:id` concorde
        { path: '', component: UserHome },

        // ...autres sous routes
      ]
    }
  ]
})
```

Une démo de fonctionnement de cet exemple peut-être trouvée [ici](https://jsfiddle.net/yyx990803/L7hscd8h/).
