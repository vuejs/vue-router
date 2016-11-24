# Daten Laden

Manchmal müssen Daten von einem Server geladen werden sobald eine Route aktiviert wird. Zum Beispiel: Bevor ein Nutzerprofil angezeigt werden kann, müssen die Daten des Nutzers vom Server geladen werden. Dies kann auf zwei Arten gemacht werden:
Sometimes you need to fetch data from the server when a route is activated. For example, before rendering a user profile, you need to fetch the user's data from the server. We can achieve this in two different ways:

- **Laden nach Navigation**: Navigiere zuerst und lade die Daten in der neuen Komponente. Während des Ladens kann ein Ladebalken oder ähnliches angezeigt werden.

- **Laden vor Navigation**: Lade Daten bevor die Navigation der Route durchgeführt wird und navigiere nachdem die Daten geladen wurden.

Technisch sind beide Optionen möglich - letztendlich hängt es davon ab welche Benutzererfahrung man erreichen möchte.

## Laden Nach Navigation

In diesem Fall, navigieren und rendern wir die neue Komponente direkt und laden die daten in der `created` Funktion der Komponente. Dies ermöglicht es uns den Nutzer zu Informieren das Daten geladen werden während die Daten über das Netzwerk nachgeladen werden. Ausserdem können wir das Laden in jeder Komponente individuell einrichten und sind nicht an ein System gebunden.

Im folgenden Beispiel haben wir eine `Post` Komponente, die Daten laden muss die mit `$route.params.id` identifiziert wird:

``` html
<template>
  <div class="post">
    <div class="loading" v-if="loading">
      Lade...
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
    // Lade die Daten wenn die Komponente erstellt wurde und die
    // Daten bereits beobachtet werden
    this.fetchData()
  },
  watch: {
    // rufe die Funktion erneut auf wenn sich die Route ändert
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.error = this.post = null
      this.loading = true
      // ersetze getPost mit der AJAX API die verwendet wird
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

## Laden vor Navigation

In diesem Fall werden die Daten geladen bevor wir in die neue Route navigieren. Die Daten werden in der `beforeRouteEnter` Funktion der neuen Komponente geladen, die `next` Funktion wird erst aufgerufen wenn alles fertig geladen ist:

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
      if (err) {
        // zeige eine globale Fehlermeldung
        next(false)
      } else {
        next(vm => {
          vm.post = post
        })
      }
    })
  },
  // wenn die Route geändert wurde und die Komponente bereits angezeigt
  // wird ist die Funktion etwas anders:
  watch: {
    $route () {
      this.post = null
      getPost(this.$route.params.id, (err, post) => {
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

Der Nutzer bleibt auf der aktuellen Komponente bis die Daten der Neuen geladen wurden. Daher ist es empfehlenswert einen Ladebalken oder ähnliches anzuzeigen während die Daten geladen werden. Falls die Daten nicht geladen werden ist es ausserdem nötig eine Fehlermeldung auszugeben.
