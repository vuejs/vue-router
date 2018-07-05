# 네비게이션 가드

이름에서 알 수 있듯이 `vue-router`가 제공하는 네비게이션 가드는 주로 리디렉션하거나 취소하여 네비게이션을 보호하는 데 사용됩니다. 라우트 탐색 프로세스에 연결하는 방법에는 전역, 라우트별 또는 컴포넌트가 있습니다.

**Params 또는 쿼리를 변경하면 네비게이션 가드가 실행되지 않습니다**. 단순히 [`$route` 객체를 감시](../essentials/dynamic-matching.md#reacting-to-params-changes)하고 그 변화에 반응하십시오. 또는 컴포넌트 가드의 `beforeRouteUpdate`를 사용하십시오

### 전역 가드

`router.beforeEach`를 사용하여 보호하기 이전에 전역 등록을 할 수 있습니다.

``` js
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  // ...
})
```

네비게이션이 트리거될 때마다 가드가 작성 순서에 따라 호출되기 전의 모든 경우에 발생합니다. 가드는 비동기식으로 실행 될 수 있으며 네비게이션은 모든 훅이 해결되기 전까지 **보류 중** 으로 간주됩니다.

모든 가드 기능은 세 가지 전달인자를 받습니다.

- **`to: 라우트`**: 대상 [Route 객체](../../api/#the-route-object) 로 이동합니다.

- **`from: 라우트`**: 현재 라우트로 오기전 라우트 입니다.

- **`next: 함수`**: 이 함수는 **훅을 해결하기 위해** 호출 되어야 합니다. 액션은 `next`에 제공된 전달인자에 달려 있습니다.

  - **`next()`**: 파이프라인의 다음 훅으로 이동하십시오. 훅이 없는 경우 네비게이션은 **승인**됩니다.

  - **`next(false)`**: 현재 네비게이션을 중단합니다. 브라우저 URL이 변경되면(사용자 또는 뒤로 버튼을 통해 수동으로 변경됨) `from`경로의 URL로 재설정됩니다.

  - **`next('/')` 또는 `next({ path: '/' })`**: 다른 위치로 리디렉션합니다. 현재 네비게이션이 중단되고 새 네비게이션이 시작됩니다.

  - **`next(error)`**: (2.4.0 이후 추가) `next`에 전달된 인자가 `Error` 의 인스턴스이면 탐색이 중단되고 `router.onError()`를 이용해 등록 된 콜백에 에러가 전달됩니다.


**항상 `next` 함수를 호출하십시오. 그렇지 않으면 훅이 절대 불러지지 않습니다.**

### Global Resolve Guards

> 2.5.0에서 추가됨

2.5.0 이후로 `router.beforeResolve`를 사용하여 글로벌 가드를 등록 할 수 있습니다. 이는 `router.beforeEach`와 유사합니다. 모든 컴포넌트 가드와 비동기 라우트 컴포넌트를 불러온 후 네비게이션 가드를 확인하기 전에 호출된다는 차이가 있습니다

### Global After Hooks

전역 훅을 등록 할 수도 있지만, 가드와 달리 이 훅은 `next` 함수를 얻지 못하며 네비게이션에 영향을 줄 수 없습니다.

``` js
router.afterEach((to, from) => {
  // ...
})
```

### 라우트 별 가드

`beforeEnter` 가드를 라우트의 설정 객체에 직접 정의 할 수 있습니다.

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      }
    }
  ]
})
```

이러한 가드는 전역 이전 가드와 동일한 서명을 가집니다.

### 컴포넌트 내부 가드

마지막으로 `beforeRouteEnter` 와 `beforeRouteLeave`를 사용하여 라우트 컴포넌트(라우터 설정으로 전달되는 컴포넌트) 안에 라우트 네비게이션 가드를 직접 정의 할 수 있습니다.

- `beforeRouteEnter`
- `beforeRouteUpdate` (2.2 버전에 추가)
- `beforeRouteLeave`

``` js
const Foo = {
  template: `...`,
  beforeRouteEnter (to, from, next) {
    // 이 컴포넌트를 렌더링하는 라우트 앞에 호출됩니다.
    // 이 가드가 호출 될 때 아직 생성되지 않았기 때문에
    // `this` 컴포넌트 인스턴스에 접근 할 수 없습니다!
  },
  beforeRouteLeave (to, from, next) {
    // 이 컴포넌트를 렌더링하는 라우트가 이전으로 네비게이션 될 때 호출됩니다.
    // `this` 컴포넌트 인스턴스에 접근 할 수 있습니다.
  }
}
```

`beforeRouteEnter` 가드는 네비게이션이 확인되기 전에 가드가 호출되어서 새로운 엔트리 컴포넌트가 아직 생성되지 않았기 때문에 `this`에 접근하지 **못합니다.**

그러나 콜백을 `next`에 전달하여 인스턴스에 액세스 할 수 있습니다. 네비게이션이 확인되고 컴포넌트 인스턴스가 콜백에 전달인자로 전달 될 때 콜백이 호출됩니다.

``` js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // `vm`을 통한 컴포넌트 인스턴스 접근
  })
}
```

`beforeRouteLeave` 안에서 `this`에 직접 접근 할 수 있습니다. leave 가드는 일반적으로 사용자가 저장하지 않은 편집 내용을 두고 실수로 라우트를 떠나는 것을 방지하는데 사용됩니다. 탐색은 `next(false)`를 호출하여 취소할 수 있습니다.

### 전체 네비게이션 시나리오

1. 네비게이션이 트리거됨.
2. 비활성화될 컴포넌트에서 가드를 호출.
3. 전역 `beforeEach` 가드 호출.
4. 재사용되는 컴포넌트에서 `beforeRouteUpdate` 가드 호출. (2.2 이상)
5. 라우트 설정에서 `beforeEnter` 호출.
6. 비동기 라우트 컴포넌트 해결.
7. 활성화된 컴포넌트에서 `beforeRouteEnter` 호출.
8. 전역 `beforeResolve` 가드 호출. (2.5이상)
9. 네비게이션 완료.
10. 전역 `afterEach` 훅 호출.
11. DOM 갱신 트리거 됨.
12. 인스턴스화 된 인스턴스들의 `beforeRouteEnter`가드에서 `next`에 전달 된 콜백을 호출합니다.
