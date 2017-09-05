# 라우터 인스턴스

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
