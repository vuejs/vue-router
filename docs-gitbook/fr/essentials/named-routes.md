# Routes nommées

Parfois il est plus pratique d'identifier une route avec un nom, tout particulièrement quand on souhaite attacher cette route ou exécuter des actions de navigation. Vous pouvez donner un nom à une route dans les options `routes` pendant la création de l'instance du routeur :

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/utilisateur/:userId',
      name: 'user',
      component: User
    }
  ]
})
```

Pour attacher une route nommée, vous pouvez passer un objet à la prop `to` du composant `router-link` :

``` html
<router-link :to="{ name: 'user', params: { userId: 123 }}">Utilisateur</router-link>
```

C'est exactement le même objet à utiliser programmatiquement avec `router.push()` :

``` js
router.push({ name: 'user', params: { userId: 123 }})
```

Dans les deux cas, le routeur va naviguer vers le chemin `/utilisateur/123`.

Un exemple complet se trouve [ici](https://github.com/vuejs/vue-router/blob/dev/examples/named-routes/app.js).
