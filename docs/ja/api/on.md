# `router.on(path, config)`

単一の root レベルの route 設定を追加します。内部的に、`router.map()` は単に 受信したルーターマップオブジェクトで各 key-value ペアに対して `router.on()` を呼びます。

### 引数

- `path: String` - [Route マッチング](../route.md#Route マッチング)を参照してください。
- `config: Object` - [Route 設定オブジェクト](map.md#Route 設定オブジェクト)を参照してください。

### 戻り値

- router インスタンス自身

### 例

``` js
router.on('/user/:userId', {
  component: {
    template: '<div>{{$route.params.userId}}</div>'
  }
})
```
