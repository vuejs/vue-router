# `canDeactivate(transition) [-> Promise | Boolean]`

検証フェーズの間でコンポーネントから離れるときに呼び出されます。

### 引数

- [`transition {Transition}`](hooks.md#トランジションオブジェクト)

  フックを解決するために、`transition.next()` を呼び出します。`transition.abort()` を呼び出すと無効となり、トランジションをキャンセルします。

### 期待される戻り値

- 任意で Promise を返します。

  - `resolve(true)` -> `transition.next()`
  - `resolve(false)` -> `transition.abort()`
  - `reject(reason)` -> `transition.abort(reason)`


- 任意で Boolean を返します。

  - `true` -> `transition.next()`
  - `false` -> `transition.abort()`

### 詳細

このフックはボトムアップから呼ばれます。親の view コンポーネント の `canDeactivate` は、子の `canDeactivate` が解決された時にのみ、呼び出されます。
