# `router.afterEach(hook)`

route トランジションが正常に**活性化フェーズに入る**とき、毎回呼び出されるグローバルアフターフック (global after hook) を設定します。

このフックが唯一トランジションが検証されたという意味を表すときに、呼ぼれるのを注意してください。すなわち、全ての `canDeactivate` と `canActivate` フックが正常に解決し、ブラウザ URL　が更新されます。これは、全ての `activate` フックが解決されたことを保証しません。

一度フックする前の唯一のグローバルです。しかしながら、このフック内部であなた自身のミドルウェアシステムを実装することができます。

### 引数

- `hook {Function}`

  hook 関数は[トランジションオブジェクト](../pipeline/hooks.html#transition-object)な単一の引数を受信します。しかし、route オブジェクトは `to` と `from` プロパティ のみだけアクセスすることができます。フック後、グローバルではトランジションメソッドを呼び出すことは**できません**。

### 例

``` js
router.afterEach(function (transition) {
  console.log('Successfully navigated to: ' + transition.to.path)
})
```
