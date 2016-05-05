# `canActivate(transition) [-> Promise | Boolean]`

検証フェーズの間に入ってくるコンポーネントに呼び出されます。

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

このフックはトップダウンで呼ばれます。子の view の `canActivate` は親の view の `canActivate` が解決された時にのみ呼び出されます。
