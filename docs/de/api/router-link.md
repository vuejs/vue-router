# `<router-link>`

`<router-link>` ist eine Komponente zum Aktivieren von Nutzernavigationen in Router-aktivierten Apps. Der Zielort ist mit dem `to`-Prop angegeben. Es wird als `<a>` und standardmäßig mit korrektem `href` gerendert, kann jedoch mit dem `tag`-Prop konfiguriert werden. Darüberhinaus erhält der Link automatisch die aktive CSS-Klasse, wenn die Ziel-Route aktiv ist.

`<router-link>` wird gegenüber fest eingebautem `<a href="">` aus folgenden Gründen bevorzugt:

- Es funktioniert im HTML5-Verlaufsmodus wie auch im Hash-Modus. Demnach ändert sich nichts, wenn der Modus jemals gewechselt wird oder in den Hash-Modus für IE9 zurückfällt.

- Im HTML5-Verlaufsmodus fängt `router-link` das Klick-Event ab, sodass der Browser nicht versucht das Fenster neuzuladen.

- Wenn die `base`-Option im HTML5-Verlaufsmodus genutzt wird, ist keine Angabe der URL des Props in `to` nötig.

### Props

- **to**

  - Typ: `string | Location`

  - notwendig

  Kennzeichnet die Ziel-Route des Links. Wenn geklickt, wird der Wert von `to` und `router.push()` intern übergeben, sodass der Wert entweder ein String oder ein Objekt der Ortsbeschreibung sein kann.


  ``` html
  <!-- literaler String -->
  <router-link to="home">Home</router-link>
  <!-- gerendert zu -->
  <a href="home">Home</a>

  <!-- JavaScript-Expression mit v-bind -->
  <router-link v-bind:to="'home'">Home</router-link>

  <!-- Auslassen von v-bind ist okay wie bei jedem anderen Prop -->
  <router-link :to="'home'">Home</router-link>

  <!-- gleich wie oben -->
  <router-link :to="{ path: 'home' }">Home</router-link>

  <!-- benannte Route -->
  <router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>

  <!-- mit Abfrage, resultiert in /register?plan=private -->
  <router-link :to="{ path: 'register', query: { plan: 'private' }}">Register</router-link>
  ```

- **replace**

  - Typ: `boolean`

  - Default: `false`

  Die Nutzung vom `replace`-Prop aktiviert `router.replace()` anstelle von `router.push()`, wenn geklickt. Die Navigation hinterlässt einen Verlaufseintrag.

  ``` html
  <router-link :to="{ path: '/abc'}" replace></router-link>
  ```

- **append**

  - Typ: `boolean`

  - Default: `false`

  Die Nutzung vom `append`-Prop hängt immer den relativen Pfad an den aktuellen an. Angenommen man navigiert von `/a` zu einem relativen Pfad `b` - ohne `append` ended man bei `/b`, mit `append` jedoch wird daraus `/a/b`.

  ``` html
  <router-link :to="{ path: 'relative/path'}" append></router-link>
  ```

- **tag**

  - Typ: `string`

  - Default: `"a"`

  Manchmal ist gewollt, dass `<router-link>` einen anderen Tag rendert, zB. `<li>`. Durch Nutzung des `tag`-Props kann man einen speziellen Tag zum Rendern definieren, welcher nach wie vor auf Klick-Events für die Navigation reagiert.

  ``` html
  <router-link to="/foo" tag="li">foo</router-link>
  <!-- gerendert als -->
  <li>foo</li>
  ```

- **active-class**

  - Typ: `string`

  - Default: `"router-link-active"`

  Konfiguration der aktiven CSS-Klasse für den aktiven Link.
  Der Standardwert kann ebenfalls mit der `linkActiveClass`-Option des Router-Konstruktors global konfiguriert werden.

- **exact**

  - Typ: `boolean`

  - Default: `false`

  Das standardmäßige Abstimmungsverfahren der aktiven Klasse ist **eingeschlossene Abstimmung**. Zum Beispiel erhält `<router-link to="/a">` die Klasse, solange der aktuelle Pfad mit `/a` beginnt.

  Die Konsequenz davon ist, dass `<router-link to=/>` für jede Route aktiv ist. Um den Link in exakten Abstimmungsmodus zu zwingen, wird der `exact`-Prop genutzt:

  ``` html
  <!-- dieser Link wird nur bei '/' aktiv -->
  <router-link to="/" exact>
  ```

  Siehe weitere Beispiele zur aktiven Linkklasse [hier](http://jsfiddle.net/fnlCtrl/dokbyypq/).

- **event**

  > 2.1.0+

  - Typ: `string | Array<string>`

  - Default: `'click'`

  Lege das Evens fest, welche die Linknavigation auslöst.


### Angabe der aktiven Klasse bei äußeren Elementen

Manchmal ist gewollt, dass die aktive Klasse an ein äußeres Element anstatt an das `<a>` gesetzt wird. In diesem Fall kann man das äußere Element als `<router-link>` rendern und damit den rohen `<a>`-Tag umschließen:

``` html
<router-link tag="li" to="/foo">
  <a>/foo</a>
</router-link>
```

In diesem Fall ist `<a>` der eigentliche Link und erhält den korrekten `href`, aber die aktive Klasse wird auf das äußere `li` gesetzt.
