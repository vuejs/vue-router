# Vues nommées

Parfois vous avez besoin d'afficher différentes vues en même temps plutôt que de les imbriquer, c.-à-d. créer un affichage avec une vue `sidebar` et une vue `main` par exemple. C'est ici que les routes nommées entrent en jeu. Au lieu d'avoir une seule balise de vue, vous pouvez en avoir une multitude et donner à chacune d'entre elles un nom. Un `router-view` sans nom aura comme nom par défaut : `default`.

``` html
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
```

Une vue est rendue en utilisant un composant, donc de multiples vues nécessitent de multiples composants pour une même route. Assurez-vous d'utiliser l'option `components` (avec un s) :

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

Une démo de cet exemple peut-être trouvée [ici](https://jsfiddle.net/posva/6du90epg/).
