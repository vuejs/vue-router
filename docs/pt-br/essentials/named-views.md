# Views nomeadas

Às vezes você precisa exibir várias visualizações ao mesmo tempo em vez de aninhá-las, p. Ex. criando um layout com um `sidebar`e um `main`. É aqui que as views são úteis. Em vez de ter uma única saída em sua view, você pode ter vários e dar a cada um deles um nome. A `router-view` sem um nome será dado `default` como nome.

``` html
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
```

Uma view é renderizada usando um componente, portanto, várias views exigem vários componentes para a mesma rota. Certifique-se de usar o `components` (com S no final):

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

Você pode visualizar uma demo [aqui](https://jsfiddle.net/posva/6du90epg/).

## Views nomeadas e aninhadas

É possível criar layouts complexos usando views nomeadas com views aninhadas. Ao fazê-lo, você também precisará nomear aninhado os componentes utilizando `router-view`. Vamos fazer um exemplo de configuração:

```
/settings/emails                                       /settings/profile
+-----------------------------------+                  +------------------------------+
| UserSettings                      |                  | UserSettings                 |
| +-----+-------------------------+ |                  | +-----+--------------------+ |
| | Nav | UserEmailsSubscriptions | |  +------------>  | | Nav | UserProfile        | |
| |     +-------------------------+ |                  | |     +--------------------+ |
| |     |                         | |                  | |     | UserProfilePreview | |
| +-----+-------------------------+ |                  | +-----+--------------------+ |
+-----------------------------------+                  +------------------------------+
```

- `Nav` é apenas um componente regular
- `UserSettings` é o componente de visualização
- `UserEmailsSubscriptions`, `UserProfile`, `UserProfilePreview` são componentes de visualização aninhados.

**Nota**: _Vamos esquecer como o HTML/CSS deve parecer fiel ao layout e foco nos componentes utilizados_

A seção `<template>` para `UserSettings` o componente no layout acima seria algo assim:

```html
<!-- UserSettings.vue -->
<div>
  <h1>User Settings</h1>
  <NavBar/>
  <router-view/>
  <router-view name="helper"/>
</div>
```

_Os componentes de exibição aninhados são omitidos aqui, mas você pode encontrar o código-fonte completo para o exemplo acima [aqui](https://jsfiddle.net/posva/22wgksa3/)_

Então você pode conseguir o layout acima com esta configuração de rota:

```js
{
  path: '/settings',
  // You could also have named views at the top
  component: UserSettings,
  children: [{
    path: 'emails',
    component: UserEmailsSubscriptions
  }, {
    path: 'profile',
    components: {
      default: UserProfile,
      helper: UserProfilePreview
    }
  }]
}
```

Você pode visualizar uma demo [aqui](https://jsfiddle.net/posva/22wgksa3/).