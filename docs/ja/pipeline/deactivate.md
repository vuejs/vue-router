# `deactivate(transition) [-> Promise]`

非活性されて削除した時、活性化フェーズのコンポーネントから離れるときに呼び出されます。

### 引数

- [`transition {Transition}`](hooks.md#トランジションオブジェクト)

  フックを解決するために `transition.next()` を呼び出します。ここで `transition.abort()` を呼び出すと、トランジションは既に検証されているため、アプリケーションは以前のルートへ戻りません。

### 期待される戻り値

- 任意で Promise を返します。
  - `resolve` -> `transition.next()`
  - `reject(reason)` -> `transition.abort(reason)`

### 詳細

このフックはボトムアップから呼ばれます。子の `deactivate` が解決された時にのみ、親 の view コンポーネントの `deactivate` が呼び出されます。

新しいコンポーネントの `activate` フックは、現状のコンポーネントの `deactivate` フック全て解決された時にのみ、呼び出されます。
