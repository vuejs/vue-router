# Récupération de données

Parfois vous avez besoin de récupérer des données depuis le serveur lorsqu'une route est activée. Par exemple, avant de faire le rendu d'un profil utilisateur, vous avez besoin de récupérer les données de l'utilisateur depuis le serveur. Nous pouvons y parvenir de deux façons différentes :

- **Récupération de données après la navigation** : effectue la navigation en premier, et récupère les données dans le hook entrant du cycle de vie d'un composant. Affiche un état de chargement pendant que les données sont en train d'être récupérées.

- **Récupération de données avant la navigation** : récupère les données avant la navigation dans la fonction d'interception d'entrée de la route, et effectue la navigation après que les données aient été récupérées.

Techniquement, les deux choix sont valides. Cela dépend de l'expérience utilisateur que vous souhaitez apporter.

## Récupération de données après la navigation

En utilisant cette approche, nous naviguons et faisons immédiatement le rendu du composant et récupérons les données via le hook `created` du composant. Cela nous donne l'opportunité d'afficher un état de chargement pendant que les données sont récupérées à travers le réseau, et nous pouvons aussi gérer le chargement différemment pour chaque vue.

Assumons que nous ayons un composant `Post` qui a besoin de récupérer des données pour un billet identifié par `$route.params.id` :

``` html
<template>
  <div class="post">
    <div class="loading" v-if="loading">
      Chargement...
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="post" class="content">
      <h2>{{ post.title }}</h2>
      <p>{{ post.body }}</p>
    </div>
  </div>
</template>
```

``` js
export default {
  data () {
    return {
      loading: false,
      post: null,
      error: null
    }
  },
  created () {
    // récupérer les données lorsque la vue est créée et
    // que les données sont déjà observées
    this.fetchData()
  },
  watch: {
    // appeler encore la méthode si la route change
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.error = this.post = null
      this.loading = true
      // remplacer `getPost` par une fonction de récupération de données
      getPost(this.$route.params.id, (err, post) => {
        this.loading = false
        if (err) {
          this.error = err.toString()
        } else {
          this.post = post
        }
      })
    }
  }
}
```

## Récupération de données avant la navigation

Avec cette approche, nous récupèrerons les données avant de naviguer vers la nouvelle route. Nous pouvons effectuer la récupération de données dans la fonction d'interception `beforeRouteEnter` du composant à venir, et seulement appeler `next` lorsque la récupération est terminée :

``` js
export default {
  data () {
    return {
      post: null,
      error: null
    }
  },
  beforeRouteEnter (to, from, next) {
    getPost(to.params.id, (err, post) => {
      next(vm => vm.setData(err, post))
    })
  },
  // quand la route change et que ce composant est déjà rendu,
  // la logique est un peu différente
  beforeRouteUpdate (to, from, next) {
    this.post = null
    getPost(to.params.id, (err, post) => {
      this.setData(err, post)
      next()
    })
  },
  methods: {
    setData (err, post) {
      if (err) {
        this.error = err.toString()
      } else {
        this.post = post
      }
    }
  }
}
```

L'utilisateur va rester sur la vue précédente pendant que la ressource est en train d'être récupérée pour la vue à venir. Il est cependant recommandé d'afficher une barre de progression ou un autre type d'indicateur pendant que les données sont en train d'être récupérées. Si la récupération échoue, il est aussi recommandé d'afficher une sorte de message d'erreur global.
