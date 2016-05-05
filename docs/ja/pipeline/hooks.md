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
    },
    canDeactivate: function (transition) {
      console.log('You are not allowed to leave.')
      transition.abort()
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

### フックの解決ルール

トランジションフック内部で非同期なタスクを実行する必要がしばしばあります。トランジションは非同期フックが解決されるまで移行しません。ここでは、フックが解決済として検討が必要なとき、決定するためのルールがあります:

1. フックが Promise を返す場合、Promise が解決されるとき、フックは解決済みになります。[詳細は以下を参照(フックで Promise を返す)](#フックで Promise を返す)してください。

2. フックが Promise を返さず、任意の引数を予期しない場合、それは同期的に解決されます。例:

 ``` js
 route: {
   activate: function (/* ここに引数がない */) {
     // Promise を返さない限り、同期的に解決します
   }
 }
 ```

3. フックが Promise を返さないが、引数 (`transition`) を予期する場合、その後、フックは、`transition.next()` 、`transition.abort()` または `transition.redirect()` の 1 つが呼ばれるときだけ、解決済みになります。例:

 ``` js
 route: {
   activate: function (transition) {
     // 1 秒後解決
     // resolve after 1 second
     setTimeout(transition.next, 1000)
   }
 }
 ```

4. `canActivate`、`canDeactivate` そして[グローバル beforeEach フック](../api/before-each.md)のような検証フックにおいて、フックが `transition` 引数を持つ場合でも、Boolean を返す値は、フックを同期的に解決します。

### フックで Promise を返す

- トランジションフックで Promise を返すとき、`transition.next` は Promise がうまく解決するときに呼ばれます。

- Promise が検証フェーズ中に拒否されている場合は、`transition.abort` を呼びます。

- Promise が活性化フェーズ中に拒否されている場合は、`transition.next` を呼びます。

- 検証フックに対して、Promise の解決値が偽となり得る値の場合、トランジションを中断します。

- 拒否された Promise がキャッチされていないエラーを持つ場合は、ルーターを作成するときに、`suppressTransitionError` オプションでそれを抑制しないかぎり、そのエラーがスローされます。

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

... クラス拡張またはミックスインがマージされるまでの間、あなたのコンポーネントが route の `data` フックを定義する場合は、route の `data` フックも提供するミックスインを使用し、両方のフックが(ミックスインのフックが最初に呼ばれる)呼ばれて、全てのフックから解決されたデータはいっしょにマージされます。

`canActivate`、`canDeactivate`、そして `canReuse` のような検証フックは、常に新しい値によって上書きされることに注意してください。
