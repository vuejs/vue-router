# `router.afterEach(hook)`

route トランジションが正常に**活性化フェーズに入る**とき、毎回呼び出されるグローバル after フック (global after hook) を追加します。

このフックが唯一トランジションが検証されたという意味を表すときに、呼ばれるのを注意してください。すなわち、全ての `canDeactivate` と `canActivate` フックが正常に解決し、ブラウザ URL が更新されます。これは、全ての `activate` フックが解決されたことを保証しません。

同じルーターに複数のグローバル after フックを追加できます。これらのフックは作成の順序で同期的に呼ばれます。

### 引数

- `hook {Function}`

  hook 関数は[トランジションオブジェクト](../pipeline/hooks.html#トランジションオブジェクト)な単一の引数を受け取ります。しかし、route オブジェクトは `to` と `from` プロパティ のみだけアクセスすることができます。グローバル after フックではトランジションメソッドを呼び出すことは**できません**。

### 戻り値

- router インスタンス自身

### 例

``` js
router.afterEach(function (transition) {
  console.log('Successfully navigated to: ' + transition.to.path)
})
```
