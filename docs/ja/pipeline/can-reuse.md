# `canReuse: Boolean | canReuse(transition) -> Boolean`

コンポーネントを再利用できるかどうか決定します。コンポーネントを再利用することが出来ない場合は、現状のインスタンスは新しいものによって置換され、そして、通常の検証フェーズと活性化フェーズを通過します。

この route オプションは純粋な Boolean 値、または同期的に Boolean を返す関数のどちらかにすることができます。**デフォルトは `true` **　です。

### 引数

- [`transition {Transition}`](hooks.md#transition-object)

  `canResue` フックでは `transition.to` と `transition.from` のみアクセスできます。

### 期待される戻り値

- Boolean を返す必要があります。偽となりうる値は、`false` として扱われます。

### 詳細

`canReuse` 潜在的に再利用可能なコンポーネント全てに対してトップダウンで、同期的に呼び出されます。

コンポーネントが再利用可能な場合、`data` フックはまだ活性化フェーズの間で呼び出されます。
