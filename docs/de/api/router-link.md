# `<router-link>`

`<router-link>` ist eine Komponente zum Auslösen von Nutzernavigationen. Die Ziel-Route wird mit der `to`-Prop angegeben. Sie wird standardmäßig als `<a>` mit korrektem `href` Attribut gerendert, das Element kann jedoch mit dem `tag`-Prop geändert werden. Darüber hinaus erhält der Link automatisch die "active" CSS-Klasse, wenn die Ziel-Route gerade aktiv ist.

`<router-link>` ist aus folgenden Gründen gegenüber fest definierten `<a href="">` links zu bevorzugen:

- Funktioniert in allen Router-Modi (history, hash, abstract) gleich. Daher muss man nichts ändern, wenn man den Modus jemals wechslen sollte oder er automatisch in den Hash-Modus für IE9 zurückfällt.

- Im HTML5-Verlaufsmodus fängt `router-link` das `click`-Event ab, sodass der Browser nicht versucht, das Fenster neu zu laden.

- Wenn die `base`-Option im HTML5-Verlaufsmodus genutzt wird, muss man die Base-URL nicht immer wieder in `to` mit angeben.

### Props

- **to**

  - Typ: `string | Location`

  - Pflichtfeld

  Kennzeichnet die Ziel-Route des Links. Wenn die Komponente geklickt wird, wird der Wert von `to` intern an `router.push()` übergeben - der Wert kann also entweder ein String oder ein Objekt sein kann.


  ``` html
  <!-- literaler String -->
  <router-link to="home">Home</router-link>
  <!-- gerendert zu -->
  <a href="home">Home</a>

  <!-- JavaScript-Expression mit v-bind -->
  <router-link v-bind:to="'home'">Home</router-link>

  <!-- Auslassen von v-bind ist okay wie bei jedem anderen Prop -->
  <router-link :to="'home'">Home</router-link>

  <!-- entspricht dem obigen Link -->
  <router-link :to="{ path: 'home' }">Home</router-link>

  <!-- benannte Route -->
  <router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>

  <!-- mit Query, resultiert in /register?plan=private -->
  <router-link :to="{ path: 'register', query: { plan: 'private' }}">Register</router-link>
  ```

- **replace**

  - Typ: `boolean`

  - Default: `false`

  Das Setzen von `replace` aktiviert `router.replace()` anstelle von `router.push()`. Die Navigation hinterlässt also keinen Verlaufseintrag.

  ``` html
  <router-link :to="{ path: '/abc'}" replace></router-link>
  ```

- **append**

  - Typ: `boolean`

  - Default: `false`

  Das Setzen von `append` hängt immer den relativen Pfad an den aktuellen an. Angenommen, man navigiert von `/a` zu einem relativen Pfad `b` - ohne `append` gelangt man zu `/b`, mit `append` jedoch wird daraus `/a/b`.

  ``` html
  <router-link :to="{ path: 'relative/path'}" append></router-link>
  ```

- **tag**

  - Typ: `string`

  - Default: `"a"`

  Manchmal soll `<router-link>` einen anderen Tag rendern, zB. `<li>`. Mit Hilfe des `tag`-Props kann man definieren, welcher Tag gerendert werden soll. Der Tag reagiert nach wie vor auf Klick-Events für die Navigation.

  ``` html
  <router-link to="/foo" tag="li">foo</router-link>
  <!-- gerendert als -->
  <li>foo</li>
  ```

- **active-class**

  - Typ: `string`

  - Default: `"router-link-active"`

  Festlegen der aktiven CSS-Klasse die zugewiesen wird, wenn der Link aktiv ist.
  Der Standardwert kann ebenfalls mit der `linkActiveClass`-Option des Router-Konstruktors global konfiguriert werden.

- **exact**

  - Typ: `boolean`

  - Default: `false`

  Das standardmäßige Matching-Verfahren der aktiven Klasse ist ein **inklusives Match**. Zum Beispiel erhält `<router-link to="/a">` die Klasse, solange der aktuelle Pfad mit `/a` beginnt.

  Eine Konsequenz daraus ist, dass `<router-link to=/>` für jede Route aktiv ist! Um den "exakten Match-Modus" zu aktivieren, nutzt man die `exact`-Prop:

  ``` html
  <!-- dieser Link wird nur bei '/' aktiv -->
  <router-link to="/" exact>
  ```

  Siehe weitere Beispiele zur aktiven Linkklasse [hier](http://jsfiddle.net/fnlCtrl/dokbyypq/).

- **event**

  > 2.1.0+

  - Typ: `string | Array<string>`

  - Default: `'click'`

  Lege das Event fest, das die Navigation auslöst.


### "active" Klasse auf ein äußeres Element anwenden

Machmal soll die aktive Klasse an einem äußeren Element anstelle das `<a>` gesetzt werden. In diesem Fall kann man das äußere Element als `<router-link>` rendern und damit den `<a>`-Tag umschließen:

``` html
<router-link tag="li" to="/foo">
  <a>/foo</a>
</router-link>
```

In diesem Fall ist `<a>` der eigentliche Link und erhält das korrekte `href` attribut, aber die aktive Klasse wird auf das äußere `<li>` gesetzt.
