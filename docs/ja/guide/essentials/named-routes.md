# 名前付きルート

<div class="vueschool"><a href="https://vueschool.io/courses/vue-router-for-everyone?friend=vuejs" target="_blank" rel="sponsored noopener" title="Learn how to build powerful Single Page Applications with the Vue Router on Vue School">Watch a free video course about Vue Router on Vue School</a></div>

しばしば、名前を使ってルートを特定できるとより便利です。特にルートにリンクするときやナビゲーションを実行するときなどです。Router インスタンスを作成するときに `routes` オプションの中でルートに名前を付けることができます。

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

名前を付けたルートにリンクするには、 `router-link` コンポーネントの `to` プロパティにオブジェクトを渡します。

``` html
<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
```

これはプログラムで `router.push()` を呼び出すときに使われるオブジェクトと全く同じです。

``` js
router.push({ name: 'user', params: { userId: 123 }})
```

どちらのケースもルーターは `/user/123` のパスにナビゲーションします。

完全な例は [こちら](https://github.com/vuejs/vue-router/blob/dev/examples/named-routes/app.js) です。
