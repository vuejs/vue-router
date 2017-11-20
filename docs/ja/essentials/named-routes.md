# 名前付きルート

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
