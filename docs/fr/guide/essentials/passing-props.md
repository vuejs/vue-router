# Passage de props aux composants de route

Utiliser `$route` dans vos composants crée un couplage fort à la route qui va limiter la flexibilité du composant qui ne pourra être utilisé que par certains URL.

Pour découpler un composant de son routeur, utilisez les props :

**Plutôt que de coupler avec `$route`**

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

**Découplez avec les `props`**

``` js
const User = {
  props: ['id'],
  template: '<div>Utilisateur {{ id }}</div>'
}
const router = new VueRouter({
  routes: [
    { path: '/utilisateur/:id', component: User, props: true },

    // pour les routes avec vues nommées, vous devez définir l'option `props` pour chaque vue nommée :
    {
      path: '/utilisateur/:id',
      components: { default: User, sidebar: Sidebar },
      props: { default: true, sidebar: false }
    }
  ]
})
```

Cela vous permet d'utiliser le composant n'importe où, ce qui le rend plus facile à réutiliser et à tester.

## Mode booléen

Quand `props` est mis à `true`, le `route.params` est remplis en tant que props du composant.

## Mode objet

Quand `props` est un objet, cela alimente les props de celui-ci. Utile quand les props sont statiques.

``` js
const router = new VueRouter({
  routes: [
    { path: '/promotion/from-newsletter', component: Promotion, props: { newsletterPopup: false } }
  ]
})
```

## Mode fonction

Vous pouvez créer une fonction qui va retourner les props. Cela vous permet de caster des paramètres dans un autre type, de combiner les valeurs statiques avec les valeurs des routes, etc.

``` js
const router = new VueRouter({
  routes: [
    { path: '/search', component: SearchUser, props: (route) => ({ query: route.query.q }) }
  ]
})
```

L'URL `/search?q=vue` passerait `{query: 'vue'}` comme `props` au composant `SearchUser`.

Essayez de garder la fonction de `props` sans état, car il n'est évalué que sur les changements de route. Utilisez un composant englobant si vous avez besoin d'état pour définir les props, ainsi la vue pourra réagir au changement d'état.

Pour une utilisation avancée, jetez un œil à cet [exemple](https://github.com/vuejs/vue-router/blob/dev/examples/route-props/app.js).
