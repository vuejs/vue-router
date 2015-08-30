# `router.stop()`

`popstate` と `hashchange` イベントのリスニングを停止します。

ルーターが停止された状態であるとき、`router.app` は破壊されず、まだ `router.go(path)` を使用してナビゲートできることに注意してください。引数なしでまた `router.start()` を呼び出すことによってルーターを再開始もできます。
