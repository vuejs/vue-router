# コンポーネント注入

### 注入されるプロパティ

ルーターインスタンスを root インスタンスに `router` オプションとして渡すことによって、全ての子コンポーネントに以下のプロパティが注入されます。

- #### $router

  ルーターインスタンス

- #### $route

  現在のアクティブな [ルート](route-object.md) 。このプロパティは読み出しのみ可能かつ変更不可ですが、watch は可能です。

### 有効になるオプション

- **beforeRouteEnter**
- **beforeRouteUpdate** (2.2 で追加)
- **beforeRouteLeave**

  [コンポーネント内ガード](../advanced/navigation-guards.md#incomponent-guards) をご参照ください。
