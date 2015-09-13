# Named Routes

時々、特にナビゲーションを実行する時、名前で route を指定するのがより便利です。このような route の設定で、route に名前を与えることができます:

``` js
router.map({
  '/user/:userId': {
    name: 'user', // route に名前を与える
    component: { ... }
  }
})
```

named route にリンクするには、このような `v-link` を使用できます:

``` html
<a v-link="{ name: 'user', params: { userId: 123 }}">User</a>
```

また、プログラム的に `router.go()` を使用して named route にナビゲートできます:

``` js
router.go({ name: 'user', params: { userId: 123 }})
```

どちらの場合も、ルーターは パス `/user/123` にナビゲートします。
