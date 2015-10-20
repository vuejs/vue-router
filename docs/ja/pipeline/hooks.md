# トランジションフック

`<router-view>` コンポーネントは、適切なトランジションパイプラインフックを実装することによってトランジションを制御する(に反応する)ことができます。これらのフックが含まれます:

- `data`
- `activate`
- `deactivate`
- `canActivate`
- `canDeactivate`
- `canReuse`

あなたのコンポーネントの下で `route` オプションをこれらのフックで実装することができます:

``` js
Vue.component('hook-example', {
  // ... 他のオプション
  route: {
    activate: function (transition) {
      console.log('hook-example activated!')
      transition.next()
    },
    deactivate: function (transition) {
      console.log('hook-example deactivated!')
      transition.next()
    }
  }
})
```

### トランジションオブジェクト

トランジションフックごとに唯一引数として `transition` オブジェクトを受け取ります。トランジションオブジェクトは以下のプロパティとメソッドを公開します:

- **transition.from**

  from からトランジションしている route を表す [route オブジェクト](../route.md)。

- **transition.to**

  ターゲットパスを表す route オブジェクト。

- **transition.next()**

  トランジションの次のステップに進むためにこのメソッドを呼び出します。

- **transition.abort([reason])**

  トランジションをキャンセル/拒否するにはこのメソッドを呼び出します。

- **transition.redirect(path)**

  現状のトランジションをキャンセルして、代わりに別のターゲット route にリダイレクトします。

全てのトランジションフックはデフォルトで非同期に実行されます。トランジションの進行を通知するために、3つのオプションがあります:

1. 明示的に `next` 、`abort` または `redirect` のいずれかを呼び出します。

2. Promise を返します。詳細は以下で説明します。

3. 検証フック (`canActivate` と `canDeactivate`) で、同期的に Boolean 値を返します。

### フックで Promise を返す

トランジションフックで Promise を返すとき、`transition.next` は Promise が解決するときに呼び出されます。もし、Promise が検証フェーズの間で拒否された場合は、`transition.abort` を呼びます。もし、活性化フェーズの間で拒否された場合は、`transition.next` を呼びます。

検証フック (`canActivate` と `canDeactivate`)で、もし Promise が偽となりうる値で解決される場合、トランジションを中止します。

もし、Promise がキャッチされていないエラーを拒否した場合は、ルーターを作成するとき `suppressTransitionError` オプションで抑制しない限りスローされます。

**例:**

``` js
// コンポーネント定義内部
route: {
  canActivate: function () {
    // `true` または `false` のどちらかで解決します
    // Promise を返すサービスと仮定します
    return authenticationService.isLoggedIn()
  },
  activate: function (transition) {
    return messageService
      .fetch(transition.to.params.messageId)
      .then((message) => {
        // それが届いたら、一度だけデータを設定します
        // コンポーネントはこれが終わるまで表示されません
        this.message = message
      })
  }
}
```

ここではちょうど例のため `activate` フックで非同期的にデータをフェッチしています。一般的にはこの目的のために、より適切な [`data` フック](data.md)があることに注意してください。

**TIP:** もし、ES6 を使用している場合、あなたのフックをクリーンなものにするために、argument destructuring を使用することができます:

``` js
route: {
  activate ({ next }) {
    // するとき:
    next()
  }
}
```

アクションのトランジションフックの完全な例については、vue-router レポジトリの [advanced example](https://github.com/vuejs/vue-router/tree/dev/example/advanced) をチェックしてください。

### フックのマージ

コンポーネントライフサイクルのフックと同様に、以下の route ライフサイクルフックは:

- `data`
- `activate`
- `deactivate`

... クラス拡張またはミックスインがマージされるまでの間、あなたのコンポーネントが route `data` フックを定義する場合は、route `data` フックも提供するミックスインを使用し、両方のフックが(ミックスインのフックが最初に呼ばれる)呼ばれて、全てのフックから解決されたデータはいっしょにマージされます。

`canActivate`、`canDeactivate`、そして `canReuse` のような検証フックは、常に新しい値によって上書きされることに注意してください。
