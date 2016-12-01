# Benannte Views

Manchmal muss man mehrere Views zur selben Zeit darstellen, anstatt sie zu verschachteln, zum Beispiel bei einem Layout mit Hauptteil und Seitenleiste. Hier helfen benannte Views aus. Anstelle eines einzigen Ortes für die View-Darstellung gibt es mehrere, die Namen tragen können. Ein `router-view` ohne Namen heißt standardmäßig `default`.

``` html
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
```

Ein View wird durch eine Komponente gerendert, deswegen benötigen mehrere Views auch mehrere Komponenten für die selbe Route. Dabei ist wichtig `components` (Plural) in den Optionen zu verwenden:

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    }
  ]
})
```

Eine Demo zu diesem Beispiel ist
[hier](https://jsfiddle.net/posva/6du90epg/) zu finden.
