# Datenbeschaffung

Manchmal müssen Daten von einem Server geladen werden, sobald eine Route aktiviert wird. Zum Beispiel müssen die Inhalte des Nutzers vom Server übertragen werden, bevor ein Nutzerprofil angezeigt werden kann. Dies wird auf zwei Arten erledigt:

- **Laden nach Navigation**: Navigiere zuerst und lade die Daten anschließend in der neuen Komponente. Während der Übertragung kann ein Ladebalken oder ähnliches angezeigt werden.

- **Laden vor Navigation**: Lade Daten bevor die Navigation der Route durchgeführt wird und navigiere nachdem die Daten geladen wurden.

Technisch sind beide Optionen möglich - letztendlich hängt es davon ab, welche Benutzererfahrung man erreichen möchte.

## Laden nach Navigation

In diesem Fall navigieren und rendern wir die neue Komponente direkt und laden die Daten in der `created`-Funktion der Komponente. Dies ermöglicht es uns den Nutzer zu informieren, dass Daten übertragen werden, während die Inhalte über das Netzwerk nachgereicht werden. Außerdem können wir die Übertragung in jeder Komponente individuell einrichten und sind nicht an ein System gebunden.

Im folgenden Beispiel haben wir eine `Post`-Komponente, welche Daten für einen Blog-Post basierend auf `$route.params.id` einholt:

``` html
<template>
  <div class="post">
    <div class="loading" v-if="loading">
      Lade..
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
    // Lade die Daten, wenn die Komponente erstellt wurde und die
    // Daten bereits überwacht werden.
    this.fetchData()
  },
  watch: {
    // Rufe die Methode erneut auf, wenn sich die Route ändert.
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.error = this.post = null
      this.loading = true
      // Ersetze 'getPost' mit einer beliebigen AJAX-API (zB. fetch, $.ajax).
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

In diesem Fall werden die Daten geladen, bevor wir in die neue Route navigieren. Die Inhalte werden in dem `beforeRouteEnter`-Schutz der neuen Komponente eingefügt. Die `next`-Funktion wird erst aufgerufen, wenn alles komplett geladen wurde:

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
        // Zeige eine globale Fehlermeldung.
        next(false)
      } else {
        next(vm => {
          vm.post = post
        })
      }
    })
  },
  // Wenn die Route geändert und die Komponente bereits gerendert wurde,
  // ist der Aufbau etwas anders:
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

Der Nutzer bleibt im aktuellen View, bis die Daten des neuen geladen wurden. Daher ist es empfehlenswert einen Ladebalken oder ähnliches anzuzeigen. Falls die Inhalte nicht komplett beschafft werden können, ist es außerdem von Vorteil, eine Fehlermeldung auszugeben.
