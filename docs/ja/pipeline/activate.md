# `activate(transition) [-> Promise]`

作成されて移行した時、活性化フェーズの間に入ってくるコンポーネントに呼び出されます。

### 引数

- [`transition {Transition}`](hooks.md#トランジションオブジェクト)

  フックを解決するために `transition.next()` を呼び出します。ここで `transition.abort()` を呼び出すと、トランジションは既に検証されているため、アプリケーションは以前のルートへ戻りません。

### 期待される戻り値

- 任意で Promise を返します。
  - `resolve` -> `transition.next()`
  - `reject(reason)` -> `transition.abort(reason)`

### 詳細

ほとんどの場合、このフックは view の切り替えのタイミングで制御するために使用されます。view の切り替えはこのフックは解決されるまで起こりません。

このフックはトップダウンで呼ばれます。子の view の `activate` は親の view の `activate` が解決された時にのみ呼び出されます。
