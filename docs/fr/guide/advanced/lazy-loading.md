# Chargement à la volée

Pendant la construction d'applications avec un empaqueteur (« bundler »), le paquetage JavaScript peut devenir un peu lourd, et donc cela peut affecter le temps de chargement de la page. Il serait plus efficace si l'on pouvait séparer chaque composant de route dans des fragments séparés, et de les charger uniquement lorsque la route est visitée.

En combinant la [fonctionnalité de composant asynchrone](https://fr.vuejs.org/v2/guide/components.html#Composants-asynchrones) de Vue et la [fonctionnalité de scission de code](https://webpack.js.org/guides/code-splitting-async/) de webpack, il est très facile de charger à la volée les composants de route.

Premièrement, un composant asynchrone peut définir une fonction fabrique qui retourne une Promesse (qui devrait résoudre le composant lui-même) :

``` js
const Foo = () => Promise.resolve({ /* définition du composant */ })
```

Deuxièmement, avec webpack 2, nous pouvons utiliser la syntaxe d'[import dynamique](https://github.com/tc39/proposal-dynamic-import) pour indiquer un point de scission de code :

``` js
import('./Foo.vue') // returns a Promise
```

::: tip Note
si vous utilisez Babel, vous aurez besoin d'ajouter le plugin [syntax-dynamic-import](http://babeljs.io/docs/plugins/syntax-dynamic-import/) de façon à ce que Babel puisse analyser correctement la syntaxe.
:::

En combinant les deux, on définit un composant asynchrone qui sera automatiquement scindé par webpack :

``` js
const Foo = () => import('./Foo.vue')
```

Rien n'a besoin d'être modifié dans la configuration de la route, utilisez `Foo` comme d'habitude.

``` js
const router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo }
  ]
})
```

## Grouper des composants dans le même fragment

Parfois on aimerait grouper tous les composants imbriqués sous la même route, dans un seul et même fragment asynchrone. Pour arriver à cela, nous avons besoin d'utiliser les [fragments nommés](https://webpack.js.org/guides/code-splitting-async/#chunk-names) en donnant un nom au fragment en utilisant une syntaxe de commentaire spéciale (requires webpack > 2.4) :

``` js
const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
const Baz = () => import(/* webpackChunkName: "group-foo" */ './Baz.vue')
```

webpack groupera tous les modules asynchrones avec le même nom de fragment dans le même fragment asynchrone.
