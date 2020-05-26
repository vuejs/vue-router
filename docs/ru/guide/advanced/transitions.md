# Анимация переходов

Поскольку `<router-view>` — это просто динамический компонент, к нему можно применять анимацию перехода с помощью `<transition>`:

```html
<transition>
  <router-view></router-view>
</transition>
```

Всё, [что сказано о `<transition>` в документации Vue](https://ru.vuejs.org/v2/guide/transitions.html), применимо и здесь.

## Анимация переходов для конкретных маршрутов

Синтаксис выше применяет одну и ту же анимацию перехода для всех маршрутов. Если для различных маршрутов хочется указать разные анимационные эффекты, можно использовать разноимённые `<transition>` непосредственно в шаблонах компонентов:

```js
const Foo = {
  template: `
    <transition name="slide">
      <div class="foo">...</div>
    </transition>
  `
}

const Bar = {
  template: `
    <transition name="fade">
      <div class="bar">...</div>
    </transition>
  `
}
```

## Динамическая анимация для маршрутов

Можно также определять анимацию перехода для маршрутов динамически, в зависимости от соотношения между старым и новым маршрутом:

```html
<!-- используем динамическое имя анимационного перехода -->
<transition :name="transitionName">
  <router-view></router-view>
</transition>
```

```js
// затем, в родительском компоненте, будем следить за переменной `$route`,
// чтобы определить, какой анимационный переход применять
watch: {
  $route(to, from) {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
  }
}
```

Полный пример можно посмотреть [здесь](https://github.com/vuejs/vue-router/blob/dev/examples/transitions/app.js).
