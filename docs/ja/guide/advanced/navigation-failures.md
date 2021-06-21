# ナビゲーションの失敗

> 3.4.0の新機能

`router-link` を使用すると、ナビゲーションを開始するためにVue Routerは `router.push` を呼び出します。ほとんどのリンクはユーザーを新しいページに移動させますが、ユーザーが同じページに留まる状況もいくつかあります。

- すでにユーザーが移動したいページにいる
- [ナビゲーションガード](./navigation-guards.md)が `next(false)` の呼び出しによって移動を中止した
- [ナビゲーションガード](./navigation-guards.md)がエラーを投げた、または `next(new Error())` を呼び出した

`router-link` コンポーネントを使用している場合、**これらの失敗はエラーとして記録されません**。しかし、 `router.push` または `router.replace` を使用している場合は、 _"Uncaught (in promise) Error"_ に続いて具体的なメッセージがコンソールに表示されることがあります。_ナビゲーションの失敗_ を区別する方法を理解しましょう。

::: tip 背景
v3.2.0では、router.pushの2つのオプションのコールバック（ `onComplete` と `onAbort` ）を通して _ナビゲーションの失敗_ が明らかになっていました。バージョン3.1.0以降、 `onComplete` / `onAbort` コールバックが提供されていない場合、 `router.push` と `router.replace` は _Promise_ を返します。この _Promise_ は `onComplete` の代わりにResolvedとなり、 `onAbort` の代わりにRejectedとなります。
:::

## ナビゲーションの失敗を検出する

_Navigation Failures_ はいくつかの追加プロパティをもつ `Error` インスタンスです。ルーターからエラーが発生したかを確認するには、 `isNavigationFailure` 関数を使用します。

```js
import VueRouter from 'vue-router'
const { isNavigationFailure, NavigationFailureType } = VueRouter

// 管理画面にアクセス
router.push('/admin').catch(failure => {
  if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
    // ユーザーに小さな通知を表示
    showToast('Login in order to access the admin panel')
  }
})
```

::: tip
`isNavigationFailure(failure)` のように2番目のパラメータを省略すると、エラーが _Navigation Failure_ かどうかのチェックのみが行われます。
:::

## `NavigationFailureType`

`NavigationFailureType` は開発者がさまざまな種類の _Navigation Failures_ を区別するのに役立ちます。次の4つの種類があります。

- `redirected`: 別の場所にリダイレクトするために、ナビゲーションガードの中で `next(newLocation)` が呼び出された
- `aborted`: ナビゲーションガードの中で `next(false)` が呼び出された
- `cancelled`: 現在のナビゲーションが終了する前に、新しいナビゲーションが実行された。例：ナビゲーションガード内で待機中に `router.push` が呼び出された
- `duplicated`: すでに目的の場所にいるため、ナビゲーションが妨げられた

## _Navigation Failures_ のプロパティ

全てのナビゲーションの失敗は、そのナビゲーションのターゲットと現在地を反映した `to` と `from` のプロパティを公開します。

```js
// 管理画面にアクセス
router.push('/admin').catch(failure => {
  if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
    failure.to.path // '/admin'
    failure.from.path // '/'
  }
})
```

全ての場合において、 `to` と `from` は正規化されたルートの場所です。
