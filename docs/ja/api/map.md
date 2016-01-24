# `router.map(routeMap)`

主に、ルーターに対して route マッピングを定義するメソッドです。

### 引数

- `routeMap: Object`

  キーはパスで、値は route 設定オブジェクトです。パスのマッチングルールは、[Route マッチング](../route.html#Route マッチング)を参照してください。

### Route 設定オブジェクト

route 設定オブジェクトは2つのフィールドを含むことができます:

- `component`: パスがマッチされるときにトップレベルの `<router-view>` outlet にレンダリングする Vue コンポーネント。値は `Vue.extend` の呼び出しによって返されたコンストラクタ、または純粋なコンポーネントオプションオブジェクトのいずれか可能です。後者の場合はルーターが暗黙的に `Vue.extend` を呼び出します。

- `subRoutes`: ここには他のサブ route マップをネストすることができます。`routeRoutes` マップ内の各サブパスついて、ルーターは親パスを追加することによって完全なパスに対してマッチします。マッチしたコンポーネントは親の route コンポーネントの `<router-view>` outlet にレンダリングされます。

### 戻り値

- router インスタンス自身

### 例

``` js
router.map({
  // コンポーネントコンストラクタ
  '/a': {
    component: Vue.extend({ /* ... */ })
  },
  // 純粋なコンポーネントオプションオブジェクト
  '/b': {
    component: {
      template: '<p>Hello from /b</p>'
    }
  },
  // nested routes
  '/c': {
    component: {
      // 単純に子の view をレンダリング
      template: '<router-view></router-view>'
    },
    subRoutes: {
      // パスが /c/d であるときにレンダリング
      '/d': { component: { template: 'D' }},
      // パスが /c/e であるときにレンダリング
      '/e': { component: { template: 'E' }}
    }
  }
})
```
