# 基本的な使い方

Vue.js + vue-router でシングルページアプリケーションを作成するのは極めてシンプルです。Vue.js で、既に我々のアプリケーションはコンポーネントに分割されています。ミックスするため vue-router を追加する時、必要なことは我々のコンポーネントを routes にマップし、そして、vue-router にどこをレンダリングするのかを知らせたるだけです。ここでは基本的な例を示します:

### HTML

``` html
<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- ナビゲーション向けに v-link ディレクティブを使用 -->
    <a v-link="{ path: '/foo' }">Go to Foo</a>
    <a v-link="{ path: '/bar' }">Go to Bar</a>
  </p>
  <!-- route outlet -->
  <router-view></router-view>
</div>
```

### JavaScript

``` js
// いくつかのコンポーネントを定義します
var Foo = {
    template: '<p>This is foo!</p>'
}

var Bar = {
    template: '<p>This is bar!</p>'
}

// router は、レンダリングするために1つの root コンポーネントが必要です
// デモ目的向けで、app テンプレートとして HTML を使用しているため、空を使用します
var App = {}

// router インスタンスを作成。
// ここでは追加的なオプションで渡すことができますが、今はシンプルに保っています
var router = new VueRouter()

// いくつかの routes を定義します
// route 毎、コンポーネントにマップが必要です
// "component" は 事実上コンポーネントコンストラクタは Vue.extend() 経由で作成されるか、
// または適切なコンポーネントオプションオブジェクトでできます
// nested routes については後で話します
router.map({
    '/foo': {
        component: Foo
    },
    '/bar': {
        component: Bar
    }
})

// 今 アプリケーションを開始することが出来ます！
// router は App のインスタンスを作成し、
// そして #app セレクタでマッチングした要素にマウントします
router.start(App, '#app')
```

[live](http://jsfiddle.net/yyx990803/xyu276sa/) の例もチェックできます。

加えて:

- root な Vue インスタンスは一度だけ初期レンダリングが完了する、 `router.app` として利用できます。

- router インスタンスは `this.$router` として router アプリケーションの全ての子孫で利用できます。
