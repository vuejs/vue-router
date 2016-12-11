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
- **router.afterEach(hook)**

  전역 네비게이션 가드 추가. [네비게이션 가드](../advanced/navigation-guards.md)를 보십시오.


- **router.push(location)**
- **router.replace(location)**
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
    normalizedTo: Location;
    resolved: Route;
    href: string;
  }
  ```
