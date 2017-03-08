# Именованные пути

Зачастую, при создании ссылок и вызове навигационных методов, удобно ссылаться на путь по его имени. Установить имя пути можно в опциях `routes` при создании инстанса Router'а:

``` js
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

Чтобы сослаться на именованный маршрут, используйте объектную запись:

``` html
<router-link :to="{ name: 'user', params: { userId: 123 }}">Пользователь</router-link>
```

Тот же самый объект можно использовать и для императивного вызова `router.push()`:

``` js
router.push({ name: 'user', params: { userId: 123 }})
```

В обоих случаях результатом будет навигационный переход на `/user/123`.

Полный пример находится [здесь](https://github.com/vuejs/vue-router/blob/dev/examples/named-routes/app.js).
