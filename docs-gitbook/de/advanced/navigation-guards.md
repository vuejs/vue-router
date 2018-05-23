# Navigation Guards ("Navigations-Wächter")

Wie der Name schon andeutet, werden "navigation guards" `vue-router` primär genutzt, um Navigationen zu "bewachen", indem diese bei Bedarf redirected oder abgebrochen werden. Es gibt dabei verschiedene Möglichkeiten, sich in den Navigationsprozess einzuklinken: global, in der Route Definition oder direkt in der Komponente.

Hinweis: Guards werden nicht ausgelöst, wenn Params oder Querys geändert werden. Beobachte in diesen Fällen einfach [das `$route`-Objekt](../essentials/dynamic-matching.md#reacting-to-params-changes), um auf Änderungen zu reagieren.

### Globale Guards

Man kann globale Before-Guards ("davor-guards") mit `router.beforeEach` registrieren:

``` js
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  // ...
})
```

Globale Before-Guards werden in der Reihenfolge aufgerufen, in der sie registriert wurden, wann immer eine Navigation ausgelöst wird. Der guard kann auch auch asynchron beendet werden - die Navigation ist solange im Status **pending**, bis alle bearbeitet wurden.

Jede Guard Funktion erhält drei Argumente:

- **`to: Route`**: das [Route-Objekt](../api/route-object.md), zu dem navigiert wird

- **`from: Route`**: die aktuelle Route, von der wegnavigiert wird

- **`next: Function`**: Diese Funktion muss aufgerufen werden, um den guard zu beenden. Die daraus resultierende Aktion hängt von den Argumenten in `next` ab:

  - **`next()`**: Gehe zum nächsten guard in der Reihe. Wenn keine mehr vorhanden sind, ist die Navigation **bestätigt**.

  - **`next(false)`**: Brich die aktuelle Navigation ab. Wurde die URL geändert (entweder manuell durch den Nutzer oder über den Zurück-Button), wird sie zurückgesetzt auf die der `from`-Route.

  - **`next('/')` or `next({ path: '/' })`**: Umleitung zu einer anderen Route. Die aktuelle Navigation wird abgebrochen und eine neue gestartet.

**Die `next`-Funktion muss immer aufgerufen werden, sonst kann der Guard nicht aufgelöst werden.**

Man kann auch globale After-Guards ("Danach-Guards") registrieren, allerdings erhalten diese keine `next`-Funktion wie der Navigationsschutz und beeinflussen nicht die Navigation selbst:

``` js
router.afterEach((to, from) => {
  // ...
})
```

### Guards in der Route

Man kann den `beforeEnter`-Guard direkt in der Router-Konfiguration definieren:

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      }
    }
  ]
})
```

Diese Guards haben die exakt gleiche Signatur wie globale Before-Guards.

### Guards in Komponenten

Zu guter Letzt kann man Guards auch direkt in den Route-Komponenten (die, die der Router-Konfiguration hinzugefügt werden) mit `beforeRouteEnter` und `beforeRouteLeave` definieren:

``` js
const Foo = {
  template: `...`,
  beforeRouteEnter (to, from, next) {
    // Wird aufgerufen bevor die Route bestätigt wird, die diese Komponenten rendert.
    // Hat keinen Zugriff auf den `this`-Kontext der Komponenteninstanz,
    // da diese noch nicht erstellt wurde, wenn die Guard-Funktion aufgerufen wird.
  },
  beforeRouteLeave (to, from, next) {
    // Wird aufgerufen, wenn von der Route, die diese Komponente rendert, wegnavigiert wird.
    // Hat Zugriff zum `this`-Kontext.
  }
}
```

Der `beforeRouteEnter`-Guard hat keinen Zugriff auf den `this`-Kontext, weil der Guard aufgerufen wird, bevor die Navigation bestätigt wurde, weshalb die Komponente noch gar nicht erzeugt wurde.

Allerdings bekommt man Zugriff auf die Instanz, indem man einen Callback an `next` übergibt. Der Callback wird ausgeführt wenn die Navigation bestätigt wurde. Die Komponente wird im Callback als Argument übergeben:

``` js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // Zugriff auf Komponenteninstanz via 'vm'
  })
}
```

In `beforeRouteLeave`-Guards kann man den `this`-Kontext aufrufen. Dieser Guard wird normalerweise verwendet um zu verhindern, dass ein Benutzer die Route versehentlich verlässt ohne ungesicherten Arbeit zu speichern. Die Navigation kann mit `next(false)` abgebrochen werden.
