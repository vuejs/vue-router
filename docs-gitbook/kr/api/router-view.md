# `<router-view>`

`<router-view>` 컴포넌트는 주어진 라우트에 대해 일치하는 컴포넌트를 렌더링하는 함수형 컴포넌트입니다. `<router-view>`에서 렌더링된 컴포넌트는 자체 `<router-view>`를 포함 할 수 있으며, 이는 중첩 된 라우트를 위해 컴포넌트를 렌더링합니다.

### Props

- **name**

  - 자료형: `string`

  - 기본값: `"default"`

  `<router-view>`가 이름을 가지고있을 때, 그것은 일치된 라우트 레코드의 `components` 옵션에서 해당 이름으로 컴포넌트를 렌더링 할 것입니다. 예제는 [이름을 가지는 뷰](../essentials/named-views.md)를 참조하십시오.

### 동작

이름이없는 모든 props는 렌더링된 컴포넌트로 전달되지만 대부분의 경우 라우트 별 데이터는 라우트 매개 변수에 포함됩니다.

이것은 단지 컴포넌트이므로 `<transition>` 및 `<keep-alive>`와 함께 작동합니다. 양쪽 모두를 사용할 때는 `<keep-alive>`를 다음과 같이 사용하십시오.

``` html
<transition>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</transition>
```
