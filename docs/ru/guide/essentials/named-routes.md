# Именованные маршруты

Иногда удобнее определять маршрут по имени, особенно при привязке к маршруту или выполнении навигации. Вы можете указать для маршрута имя в опции `routes` при создании экземпляра  маршрутизатора:

```js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:userId',
      name: 'user',
      component: User
    }
  ]
})
```

Чтобы создать ссылку на именованный маршрут, вы можете передать объект во входной параметр `to` компонента `router-link`:

```html
<router-link :to="{ name: 'user', params: { userId: 123 }}">Пользователь</router-link>
```

Тот же самый объект можно использовать и для программного вызова `router.push()`:

```js
router.push({ name: 'user', params: { userId: 123 }})
```

В обоих случаях в результате переход будет происходить на путь `/user/123`.

Полный пример можно посмотреть [здесь](https://github.com/vuejs/vue-router/blob/dev/examples/named-routes/app.js).
