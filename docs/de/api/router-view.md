# `<router-view>`

Die `<router-view>`-Komponente ist eine funktionelle Komponente, die die zutreffende Komponente zum gegebenen Pfad rendert. Komponenten, die in `router-view` gerendert werden, können auch eigene `<router-view>`s enthalten, welche Komponenten für verschachtelte Pfade rendern.

### Props

- **name**

  - Typ: `string`

  - Default: `"default"`

  Wenn `<router-view>` einen Namen trägt, rendert es die Komponente mit dem zugehörigen Namen in der `components`-Option in dem zutreffenden Route-Eintrag. Siehe [Benannte Views](../essentials/named-views.md).

### Verhalten

Alle nicht namentragenden Props werden weitergeleitet an die gerenderte Komponente, allerdings sind meistens die Daten per Route in den Route-Paramtern vorhanden.

Da es lediglich auch nur eine Komponente ist, funktioniert es mit `<transition>` und `<keep-alive>`. Wenn zusammen genutzt, muss `<keep-alive>` innerhalb erscheinen:

``` html
<transition>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</transition>
```
