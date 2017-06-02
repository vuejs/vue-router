# Le chargement à la volée

Pendant la construction d'applications avec un empaqueteur (« bundler »), le paquetage JavaScript peut devenir un peu lourd, et donc cela peut affecter le temps de chargement de la page. Il serait plus efficace si l'on pouvait séparer chaque composant de route dans des fragments séparés, et de les charger uniquement lorsque la route est visitée.

En combinant la [fonctionnalité de composant asynchrone](https://fr.vuejs.org/v2/guide/components.html#Composants-asynchrones) de Vue et la [fonctionnalité de séparation de code](https://webpack.js.org/guides/code-splitting-require/) de webpack, il est très facile de charger à la volée les composants de route.

Tout ce que nous avons à faire, c'est de définir les composants de notre route en tant que composants asynchrones :

``` js
const Foo = resolve => {
  // `require.ensure` est une syntaxe spéciale de webpack pour une séparation de code.
  require.ensure(['./Foo.vue'], () => {
    resolve(require('./Foo.vue'))
  })
}
```

Il y a aussi une alternative à la syntaxe de séparation de code utilisant l'inclusion à la sauce AMD, cela peut être simplifié en :

``` js
const Foo = resolve => require(['./Foo.vue'], resolve)
```

Rien n'a besoin d'être modifié dans la configuration de la route, utilisez `Foo` comme d'habitude.

``` js
const router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo }
  ]
})
```

### Grouper des composants dans le même fragment

Parfois on aimerait grouper tous les composants imbriqués sous la même route, dans un seul et même fragment asynchrone. Pour arriver à cela, nous avons besoin d'utiliser les [fragments nommés](https://webpack.js.org/guides/code-splitting-require/#chunkname) en donnant un nom au fragment en 3ème argument de `require.ensure`.

``` js
const Foo = r => require.ensure([], () => r(require('./Foo.vue')), 'group-foo')
const Bar = r => require.ensure([], () => r(require('./Bar.vue')), 'group-foo')
const Baz = r => require.ensure([], () => r(require('./Baz.vue')), 'group-foo')
```

webpack groupera tous les modules asynchrones avec le même nom de fragment, dans le même fragment asynchrone. Cela signifie aussi que nous n'avons plus besoin de lister explicitement les dépendances pour `require.ensure` (équivaut à passer un tableau vide).
