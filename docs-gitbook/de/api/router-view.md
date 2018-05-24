# `<router-view>`

Die `<router-view>`-Komponente ist eine 'functional' Komponente, die die gematchte Komponente zum gegebenen Pfad rendert. Komponenten, die in `router-view` gerendert werden, können auch eigene `<router-view>`s enthalten, welche dann Komponenten für verschachtelte Pfade rendern.

### Props

- **name**

  - Typ: `string`

  - Default: `"default"`

  Wenn `<router-view>` einen Namen trägt, rendert es die Komponente mit dem zugehörigen Namen in der `components`-Option in dem gematchten Route-Eintrag. Siehe [Benannte Views](../essentials/named-views.md).

### Verhalten

Alle anderen Props werden an die gerenderte Komponente weitergeleitet, allerdings sind die relevanten Daten je Route meistens in den Route-Parametern vorhanden.

Da `<router-view>` auch nur eine normale Komponente ist, funktioniert sie mit `<transition>` und `<keep-alive>`. Wenn zusammen genutzt, achte darauf dass `<keep-alive>` innerhalb der `<transition>` ist:

``` html
<transition>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</transition>
```
