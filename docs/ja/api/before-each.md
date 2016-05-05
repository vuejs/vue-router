# `router.beforeEach(hook)`

全ての route トランジションが開始する前に呼ばれるグローバル before フック (global before hook) をルーターに追加します。これは、トランジションパイプライン全体の前で、もし、フックがトランジションで拒否する場合、パイプラインは本当に開始されません。

同じルーターに複数のグローバル before フックを追加できます。これらのフックは作成の順序で呼ばれます。フックは非同期に解決することができるため、前のものが解決されるまで次のフックは呼び出されません。

グローバル before フックは[フックの解決ルール](../pipeline/hooks.html#フックの解決ルール)と同じように解決されます。

### 引数

- `hook {Function}`

  hook 関数は[トランジションオブジェクト](../pipeline/hooks.html#トランジションオブジェクト)な単一の引数を受信します。

### 戻り値

- router インスタンス自身

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
