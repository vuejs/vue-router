# 라우트 객체

**라우트 객체** 는 현재 활성 경로의 상태를 나타냅니다. 여기에는 현재 URL의 구문 분석 된 정보와 URL에서 일치하는 **라우트 기록** 이 포함됩니다.

route 객체는 변경할 수 없습니다. 모든 성공적인 네비게이션은 새로운 라우트 객체를 생성합니다.

라우트 객체는 여러 위치에서 찾을 수 있습니다.

- 컴포넌트 내부에서 `this.$route`를 사용합니다.

- 감시자 콜백에서 `$route`를 사용합니다.

- `router.match(location)` 호출의 반환 값으로 사용합니다.

- 처음 두 개의 전달인자로 내비게이션 가드에서 사용할 수 있습니다.

  ``` js
  router.beforeEach((to, from, next) => {
    // to와 from은 둘 다 라우트 객체입니다.
  })
  ```

- `scrollBehavior`함수 안에서 처음 두 개의 전달인자로 사용합니다.

  ``` js
  const router = new VueRouter({
    scrollBehavior (to, from, savedPosition) {
      // to와 from은 둘 다 라우트 객체입니다.
    }
  })
  ```

### 라우트 객체 속성

- **$route.path**

  - 자료형: `string`

    현재 경로의 경로와 동일한 문자열로 항상 절대 경로로 해석됩니다. 예 : `"/foo/bar"`를 사용하십시오.

- **$route.params**

  - 자료형: `Object`

    동적 세그먼트와 별 세그먼트의 키/값 쌍을 포함하는 객체입니다. 매개 변수가 없는 경우 값은 빈 객체가됩니다.

- **$route.query**

  - 자료형: `Object`

    쿼리 문자열의 키/값 쌍을 포함하는 객체입니다. 예를 들어 `/foo?user=1` 경로의 경우 `$route.query.user == 1`을 얻습니다. 쿼리가 없으면 값은 빈 객체가됩니다.

- **$route.hash**

  - 자료형: `string`

    현재 경로의 해시(`#`가 없는 경우).해시가 존재하지 않으면 값은 빈 문자열이됩니다.

- **$route.fullPath**

  - 자료형: `string`

    쿼리 및 해시를 포함한 전체 URL입니다.

- **$route.matched**

  - 자료형: `Array<RouteRecord>`

  현재 라우트의 모든 중첩 된 라우트 세그먼트에 대해 **라우트 레코드** 가 포함 된 배열입니다. 라우트 레코드는 `routes` 배열(그리고 `children` 배열)에 있는 객체의 복사본입니다.

  ``` js
  const router = new VueRouter({
    routes: [
      // 다음 객체는 라우트 레코드입니다.
      { path: '/foo', component: Foo,
        children: [
          // 이 또한 라우트 레코드입니다.
          { path: 'bar', component: Bar }
        ]
      }
    ]
  })
  ```

  URL이 `/foo/bar` 인 경우, `$route.matched`는 두 객체(복제 된 객체)를 자식 배열에 포함하는 배열입니다.

- **$route.name**

  현재 라우트의 이름입니다.(가지고 있는 경우). [이름을 가진](../essentials/named-routes.md)를 확인하세요


## 라우터 인스턴스

### 속성

#### router.app

- 자료형: `Vue instance`

  `router`가 주입 된 루트 Vue 인스턴스.

#### router.mode

- 자료형: `string`

  라우터가 사용하는 [mode](options.md#mode).

#### router.currentRoute

- 자료형: `Route`

  [라우트 객체](route-object.md)로 표시된 현재 라우트.

### Methods

- **router.beforeEach(guard)**
- **router.beforeResolve(guard)** (2.5.0+)
- **router.afterEach(hook)**

전역 네비게이션 가드 추가. [네비게이션 가드](../advanced/navigation-guards.md)를 보십시오.

2.5.0이상에서 세 가지 메소드 모두 등록된 guard / hook을 제거하는 함수를 반환합니다.

- **router.push(location, onComplete?, onAbort?)**
- **router.replace(location, onComplete?, onAbort?)**
- **router.go(n)**
- **router.back()**
- **router.forward()**

  프로그래밍 방식으로 새 URL로 이동합니다. [프로그래밍 방식 네비게이션](../essentials/navigation.md)을 참조하십시오.

- **router.getMatchedComponents(location?)**

  지정된 위치 또는 현재의 라우트에 일치하는 컴퍼넌트(인스턴스는 아니고 정의/생성자)의 배열을 반환합니다. 이는 주로 데이터를 프리페치(prefetching)하기 위해 서버 측 렌더링 동안 사용됩니다.

- **router.resolve(location, current?, append?)**

  > 2.1.0+

  역방향 URL 해석. `<router-link/>`에서 사용된 것과 같은 형식의 위치가 주어지면 다음과 같이 처리된 속성을 가진 객체를 반환합니다.

  ``` js
  {
    location: Location;
    route: Route;
    href: string;
  }
  ```

- `current` 현재 라우트를 나타냅니다. (대부분의 경우에 변경할 일이 없습니다.)

- `append`는 `current` 라우트에 추가할 수 있도록 합니다 ([`router-link`](router-link.md#props)처럼)

- **router.addRoutes(routes)**

  > 2.2.0+

  라우터에 동적으로 더 많은 라우트를 추가할 수 있습니다. 전달인자는 `routes` 생성자 옵션과 동일한 경로 설정 포맷을 사용하는 배열이어야 합니다.

- **router.onReady(callback, [errorCallback])**

  > 2.2.0+

  이 메소드는 라우터가 초기 탐색을 완료할 때 호출하는 콜백을 대기시킵니다. 즉, 초기 라우트와 연결된 모든 비동기 입력 훅 및 비동기 컴포넌트를 해결합니다.

  이는 서버와 클라이언트 모두 일관된 출력을 보장하기 위해 서버측 렌더링을 사용할 때 유용합니다.

- **router.onError(callback)**

  > 2.4.0+

라우트 탐색 중에 에러가 발견되면 호출 될 콜백을 등록하십시오. 호출 할 에러에 유의하십시오. 에러는 다음 시나리오 중 하나이어야합니다.

  - 에러는 라우트 가드 기능 내에서 동기적으로 발생한 경우.
  - 에러는 라우트 가드 함수 내에서 `next(err)`를 호출하여 캐치한 경우
  - 라우트를 렌더링하는데 필요한 비동기 컴포넌트를 처리하려고 할 때 에러가 발생한 경우.
