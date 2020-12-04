# Views Nomeadas

Algumas vezes você precisa mostrar multiplas views ao mesmo tempo ao invés de aninha-las, por exemplo. Criar um layout com uma view para o `sidebar` e outra para o `main`. São em situações como estás onde as views nomeadas vem mesmo a calhar. Ao invés de ter uma única saida em sua view, você pode ter multiplas e dar a cada uma delas um nome. Uma `router-view` sem um nome irá receber `default` como seu nome.

``` html
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
```

Uma view é renderizada por usar um component, logo multiplas views requer multiplos componentes para a mesma rota. Certifique-se de usar a opção `components` (com um s):

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

Uma demostração deste exemplo funcionando pode ser achado [aqui](https://jsfiddle.net/posva/6du90epg/).

## Views Nomeadas Aninhadas

É possível criar um layout complexo usando views nomeadas com views aninhadas. Para conseguir esse feito, você irá precisar também nomear componentes `router-view` aninhados. Vamos considerar um painel de configuração como exemplo:

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
- `UserSettings` é o componente view
- `UserEmailsSubscriptions`, `UserProfile`, `UserProfilePreview` são componentes view aninhados

**Atenção**: _Vamos esquecer sobre como o HTML/CSS deveriam parecer para representar tal layout e focar no componente usado._

O seção `<template>` para o componente `UserSettings` no layout acima se pareceria com alguma coisa semalhante a isto:

```html
<!-- UserSettings.vue -->
<div>
  <h1>User Settings</h1>
  <NavBar/>
  <router-view/>
  <router-view name="helper"/>
</div>
```

_Os componentes views aninhados são omitidos aqui porém você pode achar o código-fonte completo para o exemplo acima [aqui](https://jsfiddle.net/posva/22wgksa3/)._

Depois você pode chegar ao layout acima com esta configuração de rota:

```js
{
  path: '/settings',
  // Você poderia também ter views nomeadas no topo
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

Uma demostração deste exemplo funcionando pode ser achado [aqui](https://jsfiddle.net/posva/22wgksa3/).
