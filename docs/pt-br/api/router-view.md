# `<router-view>`

O componente `<router-view>` é um componente funcional que processa o componente correspondente para o caminho dado. Os componentes representados em `<router-view>` também podem conter o seu próprio `<router-view>`, que renderizará componentes para caminhos aninhados.

### Props

- **name**

  - type: `string`

  - default: `"default"`

  Quando um `<router-view>` tem um nome, ele renderizará o componente com o nome correspondente na opção `components` da gravação da rota correspondente. Veja [Exibições Nomeadas](../essentials/named-views.md) como exemplo.

### Behavior

Todos os adereços não pertencentes ao nome serão transmitidos ao componente renderizado, no entanto, a maior parte do tempo, os dados por rota estão contidos nos params da rota.

Como é apenas um componente, ele funciona com `<transition>` e `<keep-alive>`. Ao usar os dois juntos, certifique-se de usar `<keep-alive>` dentro:

``` html
<transition>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</transition>
```
