# `<router-view>`

`<router-view>` コンポーネントは与えられたパスに対してマッチしたコンポーネントを描画する関数型コンポーネントです。`<router-view>` の中で描画されるコンポーネント自身もまた、ネストされたパスに対してコンポーネントを描画するための `<router-view>` を持つことができます。

### プロパティ

- **name**

  - 型: `string`

  - デフォルト: `"default"`

  `<router-view>` が名前を持つ時、マッチしたルートレコードの `components` オプション内で対応する名前のコンポーネントを描画します。例は [名前付きビュー](../essentials/named-views.md) をご参照ください。

### 振る舞い

name ではないプロパティも描画されるコンポーネントに渡されますが、ほとんどの場合ルート単位のデータはルートのパラメーターに含まれています。

これは普通のコンポーネントなので、 `<transition>` と `<keep-alive>` と共に動作します。両方を同時に使用する場合は `<keep-alive>` を内側にするようにしてください。

``` html
<transition>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</transition>
```
