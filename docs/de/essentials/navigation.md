# Programmatische Navigation

Neben der Nutzung von `router-link` zum Kreieren von Ankerpunkten für deklarative Navigation gibt es die Möglichkeit programmatisch mit Hilfe der Methoden der Router-Instanz zu navigieren.

#### `router.push(location)`

Um zu einer anderen URL zu navigieren, nutzt man `router.push`. Diese Methode setzt einen neuen Eintrag in den Browser-Verlauf, sodass der Nutzer, wenn er die Zurück-Schaltfläche des Browsers betätigt, auf die vorherige URL zurückkehrt.

Das ist die Methode, die intern aufgerufen wird, wenn `<router-link>` geklickt wird. Demnach ist das Anlicken von `<router-link :to="...">` das Äquivalent zu `router.push(...)`.

| Deklarativ | Programmatisch |
|-------------|--------------|
| `<router-link :to="...">` | `router.push(...)` |

Das Argument kann ein String des Pfades oder eine Beschreibung des Ortes als Objekt sein.

``` js
// String
router.push('home')

// Objekt
router.push({ path: 'home' })

// benannte Route
router.push({ name: 'user', params: { userId: 123 }})

// mit Abfrage, resultiert in /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})
```

#### `router.replace(location)`

Es verhält sich wie `router.push`, allerdings erstellt es keinen neuen Eintrag im Browser-Verlauf. Es ersetzt lediglich den aktuellen Eintrag.

| Deklarativ | Programmatisch |
|-------------|--------------|
| `<router-link :to="..." replace>` | `router.replace(...)` |


#### `router.go(n)`

Diese Methode erlaut einen einfachen Integer als Parameter, welcher angibt, wie viele Schritte im Browser-Verlauf vor- oder rückwärts zu gehen sind - ähnlich dem `window.history.go(n)`.

Beispiele

``` js
// gehe einen Eintrag vorwärts - gleich dem history.forward()
router.go(1)

// gehe einen Eintrag zurück - gleich dem history.back()
router.go(-1)

// gehe drei Einträge vor
router.go(3)

// scheitert ohne Nachricht, wenn nicht genügend Einträge vorhanden sind
router.go(-100)
router.go(100)
```

#### Manipulation des Verlaufs

Es fällt auf, dass `router.push`, `router.replace` und `router.go` Gegenstücke von [`window.history.pushState`, `window.history.replaceState` und `window.history.go`](https://developer.mozilla.org/de/docs/Web/API/History) sind, da sie die `window.history`-API imitieren.

Deswegen ist es einfach den Verlauf zu manipulieren, wenn man sich mit den [Browser-Verlauf-APIs](https://developer.mozilla.org/de/docs/Web/Guide/DOM/Manipulating_the_browser_history)
auskennt.

Erwähnenswert ist es, dass Navigationsmethoden von `vue-router` (`push`, `replace`, `go`) konstant in allen Modi (`history`, `hash`, `abstract`) funktionieren.
