# Pour commencer

> Nous utiliserons [ES2015](https://github.com/lukehoban/es6features) dans les exemples de code dans ce guide.

Créer une application monopage avec Vue + Vue Router est vraiment simple. Avec Vue.js, nous concevons déjà notre application avec des composants. En ajoutant vue-router dans notre application, tout ce qu'il nous reste à faire est de relier nos composants aux routes, et de laisser vue-router faire le rendu. Voici un exemple de base :

> Tous les exemples utiliseront la version complète de Vue pour rendre l'analyse de template possible. Plus de détails [ici](https://fr.vuejs.org/guide/installation.html#Runtime-Compiler-vs-Runtime-seul).

### HTML

``` html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>

<div id="app">
  <h1>Bonjour l'application !</h1>
  <p>
    <!-- utilisez le composant router-link pour la navigation. -->
    <!-- spécifiez le lien en le passant à la prop `to` -->
    <!-- `<router-link>` sera rendu en tag `<a>` par défaut -->
    <router-link to="/foo">Aller à Foo</router-link>
    <router-link to="/bar">Aller à Bar</router-link>
  </p>
  <!-- balise pour le composant router-view -->
  <!-- le composant correspondant à la route sera rendu ici -->
  <router-view></router-view>
</div>
```

### JavaScript

``` js
// 0. Si vous utilisez un système de module (par ex. via vue-cli), il faut importer Vue et Vue Router et ensuite appeler `Vue.use(VueRouter)`.

// 1. Définissez les composants de route.
// Ces derniers peuvent être importés depuis d'autre fichier
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. Définissez des routes.
// Chaque route doit correspondre à un composant. Le « composant » peut
// soit être un véritable composant créé via `Vue.extend()`, ou juste un
// objet d'options.
// Nous parlerons plus tard des routes imbriquées.
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 3. Créez l'instance du routeur et passez l'option `routes`.
// Vous pouvez également passer des options supplémentaires,
// mais nous allons faire simple pour l'instant.
const router = new VueRouter({
  routes // raccourci pour `routes: routes`
})

// 5. Créez et montez l'instance de Vue.
// Soyez sûr d'injecter le routeur avec l'option `router` pour
// permettre à l'application tout entière d'être à l'écoute du routeur.
const app = new Vue({
  router
}).$mount('#app')

// L'application est maintenant en marche !
```

En injectant le routeur, nous y avons accès à travers `this.$router`. Nous avons également accès à la route courante derrière `this.$route` depuis n'importe quel composant :

```js
// Home.vue
export default {
  computed: {
    username () {
      // Nous verrons ce que représente `params` dans un instant.
      return this.$route.params.username
    }
  },
  methods: {
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    }
  }
}
```

Dans les documentations, nous allons souvent utiliser l'instance `router`. Gardez à l'esprit que l'utilisation de `this.$router` est exactement la même chose que celle de `router`. La raison pour laquelle nous utilisons `this.$router` est la possibilité ainsi offerte de ne pas avoir à importer le routeur dans chaque fichier de composant ayant besoin d'accéder au routage.

Vous pouvez aussi regarder cet [exemple](https://jsfiddle.net/yyx990803/xgrjzsup/).

Notez qu'un `<router-link>` obtiendra automatiquement la classe `.router-link-active` lorsque sa route cible correspond à la route actuelle. Vous pouvez en apprendre plus à propos de cela dans sa [documentation d'API](../api/router-link.md).
