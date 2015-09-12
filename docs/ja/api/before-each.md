# `router.beforeEach(hook)`

全ての route トランジションが開始する前に呼ばれるグローバルビフォーフック (global before hook) をルーターに追加します。これは、トランジションパイプライン全体の前で、もし、フックがトランジションで拒否する場合、パイプラインは本当に開始されません。

同じルーターにフックする前に複数のグローバルを追加できます。これらのフックは作成の順序で呼ばれます。フックは非同期に解決することができるため、前のものが解決されるまで次のフックは呼び出されません。

### 引数

- `hook {Function}`

  hook 関数は[トランジションオブジェクト](../pipeline/hooks.html#transition-object)な単一の引数を受信します。

### 例

基本

``` js
router.beforeEach(function (transition) {
  if (transition.to.path === '/forbidden') {
    transition.abort()
  } else {
    transition.next()
  }
})
```

Promise + ES6

``` js
router.beforeEach(function ({ to, next }) {
  if (to.path === '/auth-required') {
    // true または false で解決する Promise を返します
    return AuthService.isLoggedIn()
  } else {
    next()
  }
})
```
