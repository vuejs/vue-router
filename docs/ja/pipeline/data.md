# `data(transition) [-> Promise]`

`activate` フックが解決された後、活性化フェーズの間に入ってくるコンポーネントに呼び出されます。**route が変更されたり現在のコンポーネントが再利用されるときもまた呼び出されます。**このフックをロードするために使用して現在のコンポーネントでデータを設定します。

### 引数

- [`transition {Transition}`](hooks.md#トランジションオブジェクト)

  `transition.next(data)` の呼び出しはコンポーネントの `data` の各プロパティに設定します。例えば `{ a: 1, b: 2 }` が引数に指定される場合、ルーターは `component.$set('a', 1)` と `component.$set('b', 2)` を呼びます。

### 期待される戻り値

- 任意で Promise を返します。
  - `resolve(data)` -> `transition.next(data)`
  - `reject(reason)` -> `transition.abort(reason)`

**または**、Promise を含んでいるオブジェクトを返します。詳細は以下の [Promise シンタックスシュガー](#Promise シンタックスシュガー) を参照してください。

### 詳細

`data` トランジションフックは、`activate` フックが解決された直後に呼び出され、直前に view の切り替えが実行されます。entering なコンポーネントは、**`$loadingRouteData`** メタプロパティを取得します。そのプロパティは `true` 値で開始し、`data` フックが解決されるとき、`false` に設定します。このプロパティは entering なコンポーネントに対してローディング状態を表示するために使用することができます。

解決したとき、コンポーネントは `'route-data-loaded'` イベントを発行します。

`data` フックは `activate` とは以下が異なります:

1. たとえ現状のコンポーネントが再利用される場合でも、`data` は毎回 route が変更する度に呼ばれるのに対し、`activate` はコンポーネントが新しく作成されるときだけ呼ばれます。

  route が `/message/:id` に対してコンポーネントがあり、現在 `/message/1` のパスであると想像してください。ユーザーが `/message/2` にナビゲートするとき、現状のコンポーネントは再利用できますが、`activate` フックは呼ばれません。しかし、フェッチしたくて新しい `id` パラメータに基づいたデータを更新したい場合、ほとんどの場合は `activate` の代わりに `data` でデータをフェッチするのは道理にかないます。

2. `activate` の債務は新しいコンポーネントへの切り替えのタイミングを制御しています。比較して、`data` は `activate` が解決される直後と view の切り替えが起こる直前に呼びされるため、データのフェッチと新しいコンポーネントが入ってくるアニメーションを並行して行い、`data` が解決される前に "loading" 状態になります。

  それではここでユーザーエクスペリエンスの違いを考えてみましょう:

  - もし新しいコンポーネントを表示する前にデータがフェッチされるまで待つ場合は、ユーザーはインターフェイスが view の切り替え前に一瞬 "行き詰まらせる" ような感じになります。

  - 代わりに、"loading" 状態で新しいコンポーネントを表示している間、すぐにユーザー入力に反応し view の切り替えを開始することができます。もし合間で CSS トランジションを使用している場合、アニメーション時間はデータ待ち時間とうまく重なり合うことができます。

そうは言っても、view を切り替える前、データがロードされるまでにまだ待つのを希望するならば、あなたのコンポーネントの `route` オプション内部で **`waitfordata: true`** を追加することができます。

### 例

`transition.next` による呼び出し:

``` js
route: {
  data: function (transition) {
    setTimeout(function () {
      transition.next({
        message: 'data fetched!'
      })
    }, 1000)
  }
}
```

Promise による呼び出し:

``` js
route: {
  data: function (transition) {
    return messageService
      .fetch(transition.to.params.messageId)
      .then(function (message) {
        return { message: message }
      })
  }
}
```

Promise & ES6 で並行なリクエスト:

``` js
route: {
  data ({ to: { params: { userId }}}) {
    return Promise.all([
      userService.get(userId),
      postsService.getForUser(userId)
    ]).then(([user, post]) => ({ user, post }))
  }
}
```

ES5 による上記と等価:

``` js
route: {
  data (transition) {
    var userId = transition.to.params.userId
    return Promise.all([
      userService.get(userId),
      postsService.getForUser(userId)
    ]).then(function (data) {
      return {
        user: data[0],
        posts: data[1]
      }
    })
  }
}
```

テンプレートで `loadingRouteData` を使用:

``` html
<div class="view">
  <div v-if="$loadingRouteData">Loading ...</div>
  <div v-if="!$loadingRouteData">
    <user-profile user="{{user}}"></user-profile>
    <user-post v-for="post in posts"></user-post>
  </div>
</div>
```

### Promise シンタックスシュガー

上記のパラレルなデータをフェッチングする例は、複数の Pomise を1つのものに結合するために `Promise.all` を利用するのを要求し、destructuring とフォーマットはまだ面倒です。`vue-router` は Promise (もちろん Promise でないフィールドを含むこともできます) を含んだオブジェクトを返すことができるシンタックスシュガーを提供します。ここでシンタックスシュガーと ES6 を使用する同じ例を示します:

``` js
route: {
  data: ({ to: { params: { userId }}}) => ({
    user: userService.get(userId),
    post: postsService.getForUser(userId)
  })
}
```

それらが解決されるとき、ルーターは 対応する Promise が解決した値をコンポーネント `user` と `post` に設定します。全ての Promise が解決された時、`$loadingRouteData` は `false` に設定されます。

ES5 での等価:

``` js
route: {
  data: function (transition) {
    var userId = transition.to.params.userId
    return {
      user: userService.get(userId),
      post: postsService.getForUser(userId)
    }
  }
}
```
