# 스크롤 동작

클라이언트 측 라우팅을 사용할 때 새로운 경로로 이동할 때 맨 위로 스크롤하거나 실제 페이지를 다시 로드하는 것처럼 컨텐츠 항목의 스크롤 위치를 유지할 수 있습니다. `vue-router`는 이러한 것들을 할 수 있으며, 라우트 탐색에서 스크롤 동작을 완전히 사용자 정의할 수 있게합니다.

**참고: 이 기능은 HTML5 히스토리 모드에서만 작동합니다.**

라우터 인스턴스를 생성 할 때 `scrollBehavior` 함수를 제공 할 수 있습니다.

``` js
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // 원하는 위치로 돌아가기
  }
})
```

`scrollBehavior` 함수는 `to`와 `from` 라우트 객체를받습니다. 세 번째 전달인자인 `savedPosition`은 브라우저의 뒤로/앞으로 버튼으로 트리거되는 `popstate` 네비게이션인 경우에만 사용할 수 있습니다.

이 함수는 스크롤 위치 객체를 반환 할 수 있습니다. 객체는 다음과 같은 형태 일 수 있습니다.

- `{ x: number, y: number }`
- `{ selector: string, offset? : { x: number, y: number }}` (offset은 2.6.0 이상만 지원)

잘못된 값이나 빈 객체가 반환되면 스크롤이 발생하지 않습니다.

예제:

``` js
scrollBehavior (to, from, savedPosition) {
  return { x: 0, y: 0 }
}
```

그러면 모든 라우트 네비게이션에 대해 페이지가 맨 위로 스크롤됩니다.

`savedPosition`을 반환하면 뒤로/앞으로 버튼으로 탐색할 때 네이티브와 같은 동작이 발생합니다.

``` js
scrollBehavior (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}
```

"anchor로 스크롤" 동작을 시뮬레이트하려면 다음을 수행하십시오.

``` js
scrollBehavior (to, from, savedPosition) {
  if (to.hash) {
    return {
      selector: to.hash
      // , offset: { x: 0, y: 10 }
    }
  }
}
```

또한 [라우트 메타 필드](meta.md)를 사용하여 세밀한 스크롤 동작 제어를 구현할 수 있습니다. 전체 [예제](https://github.com/vuejs/vue-router/blob/dev/examples/scroll-behavior/app.js)를 확인하십시오.
