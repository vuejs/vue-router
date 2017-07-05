# Daten laden

Oftmals müssen wir Daten von einem Server laden, sobald eine Route aktiviert wird. Zum Beispiel müssen die Daten des Users vom Server geladen werden, bevor das Userprofil angezeigt werden kann. Dies kann auf zwei Arten erreicht werden:

- **Laden nach der Navigation**: Der Router schließt zuerst die Navigation ab und wir laden die Daten anschließend in der neuen Komponente. Während der Übertragung kann ein Ladebalken oder ähnliches in der Komponente angezeigt werden.

- **Laden der Navigation**: Wir laden Daten bevor die Navigation der Route durchgeführt wird und navigieren danach erst zur neuen Route.

Technisch gesehen sind beide Optionen gleich "gut" - letztendlich hängt es davon ab, welche Benutzererfahrung man erreichen möchte.

## Laden nach der Navigation

In diesem Fall navigieren und rendern wir die neue Komponente direkt und laden die Daten im `created`-Hook der Komponente. Das ermöglicht es uns dem Nutzer in der neuen Komponente einen Ladebalken oder ähnliches anzuzeigen während der Content vom Server geladen wird. Außerdem können wir so den Ladevorgang in jeder Komponente individuell gestalten.

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
    // Daten bereits observed ("beobachtet") werden.
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
      // Ersetze 'getPost' mit einem beliebigen AJAX-tool / API-Wrapper
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

## Laden vor der Navigation

In diesem Fall werden die Daten geladen, bevor wir in die neue Route navigieren. Die Inhalte werden in dem `beforeRouteEnter`-Guard der neuen Komponente geladen. Die `next`-Funktion wird erst aufgerufen, wenn der Vorgang abgeschlossen ist:

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

Der Nutzer bleibt im aktuellen View, während die Daten für den neuen View geladen werden. Daher ist es während des Ladevorgangs empfehlenswert, innerhalb der App einen Ladebalken oder ähnliches anzuzeigen. Wenn der Ladevorgang fehlschlägt, ist es außerdem wichtig, eine Fehlermeldung auszugeben.
