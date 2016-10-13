# ルートメタフィールド

ルートの定義をする際に `meta` フィールドを含めることができます。

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      children: [
        {
          path: 'bar',
          component: Bar,
          // メタフィールド
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})
```

ではどのように `meta` フィールドにアクセスしましょう？

まず、 `routes` 設定の中の各ルートオブジェクトは**ルートレコード**と呼ばれます。ルートレコードはネストされているかもしれません。したがって、ルートがマッチした時に、潜在的には 1 つ以上のルートレコードがマッチされる可能性があります。

例えば上記のルート設定で、 `/foo/bar` という URL は親のルートレコードにも子のルートレコードにもマッチします。

ルートにマッチした全てのルートレコードは `$route.matched` 配列として `$route` オブジェクト上で (また、ナビゲーションガード上のルートオブジェクトでも) アクセス可能になります。

メタフィールドをグローバルナビゲーションガードで確認するユースケースの例:

``` js
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // このルートはログインされているかどうか認証が必要です。
    // もしされていないならば、ログインページにリダイレクトします。
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // next() を常に呼び出すようにしてください!
  }
})

```
