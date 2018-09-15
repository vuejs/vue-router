---
sidebar: auto
---

# API 레퍼런스

## `<router-link>`

`<router-link>`는 라우터 지원 앱에서 사용자 네비게이션을 가능하게하는 컴포넌트입니다. 목표 위치는 `to` prop로 지정됩니다. 기본적으로 올바른 `href`를 갖는 `<a>`태그로 렌더링 되지만 `tag` prop로 구성 될 수 있습니다. 또한 대상 라우트가 활성화되어 있으면 링크가 자동으로 active CSS 클래스를 가져옵니다.

`<router-link>`는 다음과 같은 이유로 하드 코드 된 `<a href="...">`보다 선호됩니다.

- HTML5 히스토리 모드와 해시 모드에서 모두 동일한 방식으로 작동하므로 모드를 트랜지션하기로 결정하거나 라우터가 IE9에서 해시 모드로 트랜지션 한 경우 변경할 필요가 없습니다.

- HTML5 히스토리 모드에서, `router-link`는 클릭 이벤트를 차단하여 브라우저가 페이지를 다시 로드하지 않도록합니다.

- HTML5 히스토리 모드에서 `base` 옵션을 사용할 때 `to` prop의 URL에 이를 포함 할 필요가 없습니다.

## Props

### to

  - 자료형: `string | Location`

  - 필수

  링크의 대상 라우트를 나타냅니다. 클릭하면, `to` prop의 값은 내부적으로 `router.push()`에 전달 될 것이므로 값은 문자열이나 위치 디스크립터 객체가 될 수 있습니다.

  ``` html
  <!-- 리터럴 string -->
  <router-link to="home">Home</router-link>
  <!-- 이렇게 렌더링 됩니다. -->
  <a href="home">Home</a>

  <!-- `v-bind`를 이용한 표현식 -->
  <router-link v-bind:to="'home'">Home</router-link>

  <!-- `v-bind`를 생략하면 다른 prop를 바인딩 하는 것과 같습니다. -->
  <router-link :to="'home'">Home</router-link>

  <!-- 위와 같습니다. -->
  <router-link :to="{ path: 'home' }">Home</router-link>

  <!-- 이름을 가지는 라우트 -->
  <router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>

  <!-- 쿼리가 있으면, `/register?plan=private` 이 됩니다. -->
  <router-link :to="{ path: 'register', query: { plan: 'private' }}">Register</router-link>
  ```

### replace

  - 자료형: `boolean`

  - 기본값: `false`

  `replace` prop를 설정하면 클릭할 때 `router.push()` 대신 `router.replace()`를 호출할 것이므로 내비게이션은 히스토리 레코드를 남기지 않을 것입니다.

  ``` html
  <router-link :to="{ path: '/abc'}" replace></router-link>
  ```

### append

  - 자료형: `boolean`

  - 기본값: `false`

  `append` prop를 설정하면 항상 상대 경로가 현재 경로에 추가됩니다. 예를 들어`/a`에서 상대 링크 `b`로 이동한다고 가정하면 `append`없이 `/b`에서 끝나지만 `append`로 `/a/b`에서 끝납니다 .

  ``` html
  <router-link :to="{ path: 'relative/path'}" append></router-link>
  ```

### tag

  - 자료형: `string`

  - 기본값: `"a"`

  때때로 우리는 `<router-link>`를 `<li>`과 같은 다른 태그로 렌더링되길 바랍니다. 그런 다음 `tag` prop를 사용하여 렌더링할 태그를 지정할 수 있으며 탐색을 위해 클릭 이벤트를 계속 수신합니다.

  ``` html
  <router-link to="/foo" tag="li">foo</router-link>
  <!-- 이렇게 렌더링됩니다 -->
  <li>foo</li>
  ```

### active-class

  - 자료형: `string`

  - 기본값: `"router-link-active"`

  링크가 활성화 되어 있을 때 적용된 active CSS 클래스를 구성합니다. 기본값은 `linkActiveClass` 라우터 생성자 옵션을 통해 전역적으로 설정될 수 있습니다.

### exact

  - 자료형: `boolean`

  - 기본값: `false`

  기본 활성 클래스 매치 동작은 **포괄적인 매칭** 입니다. 예를 들어, `<router-link to="/a">`는 현재 경로가 `/a` 또는 `/a/`로 시작하는 한 이 클래스를 적용합니다.

  이것의 결과는 `<router-link to="/">`가 모든 라우터에 대해 활성화 될 것입니다! 링크를 "완전 일치 모드"로 강제하려면 `exact` prop를 사용하십시오.

  ``` html
  <!-- 이 링크는 `/` 에서만 active 됩니다 -->
  <router-link to="/" exact>
  ```

  active 링크 클래스를 설명하는 추가 [예제](https://jsfiddle.net/8xrk1n9f/)를 확인 하십시오.

### event

  > 2.1.0+

  - 자료형: `string | Array<string>`

  - 기본값: `'click'`

  링크 네비게이션을 트리거 할 수있는 이벤트를 지정합니다.

### exact-active-class

  > 2.5.0+
  - 자료형: `string`
  - 기본값: `"router-link-exact-active"`

 정확하게 일치하는 링크가 활성된 상태일 때 적용되는 CSS 클래스를 지정합니다. 기본값은`linkExactActiveClass` 라우터 생성자 옵션을 통해 전역으로 설정 될 수 있습니다.


### 외부 엘리먼트에 active 클래스 적용하기

때로 우리는 active 클래스가 `<a>` 태그 자체가 아닌 외부 엘리먼트에 적용되는 것을 원할 수 있습니다. 이 경우 `<router-link>` 를 사용하여 외부 엘리먼트를 렌더링하고 원시 `<a>`는 내부에 작성합니다.

``` html
<router-link tag="li" to="/foo">
  <a>/foo</a>
</router-link>
```

이 경우 `<a>`는 실제 링크가 될 것이고(올바른 `href`를 얻습니다.), 활성 클래스는 바깥 쪽 `<li>`에 적용됩니다.

## `<router-view>`

`<router-view>` 컴포넌트는 주어진 라우트에 대해 일치하는 컴포넌트를 렌더링하는 함수형 컴포넌트입니다. `<router-view>`에서 렌더링된 컴포넌트는 자체 `<router-view>`를 포함 할 수 있으며, 이는 중첩 된 라우트를 위해 컴포넌트를 렌더링합니다.

## `<router-view>` props

### name**

  - 자료형: `string`

  - 기본값: `"default"`

  `<router-view>`가 이름을 가지고있을 때, 그것은 일치된 라우트 레코드의 `components` 옵션에서 해당 이름으로 컴포넌트를 렌더링 할 것입니다. 예제는 [이름을 가지는 뷰](../guide/essentials/named-views.md)를 참조하십시오.

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

## 라우터 인스턴스

### router.app

- 자료형: `Vue instance`

  `router`가 주입 된 루트 Vue 인스턴스.

### router.mode

- 자료형: `string`

  라우터가 사용하는 [mode](./#mode).

### router.currentRoute

- 자료형: `Route`

  [라우트 객체](#the-route-object)로 표시된 현재 라우트.

## Methods

### router.beforeEach
### router.beforeResolve
### router.afterEach

전역 네비게이션 가드 추가. [네비게이션 가드](../guide/advanced/navigation-guards.md)를 보십시오.

2.5.0이상에서 세 가지 메소드 모두 등록된 guard / hook을 제거하는 함수를 반환합니다.

### router.push
### router.replace
### router.go
### router.back
### router.forward

  프로그래밍 방식으로 새 URL로 이동합니다. [프로그래밍 방식 네비게이션](../guide/essentials/navigation.md)을 참조하십시오.

### router.getMatchedComponents

  지정된 위치 또는 현재의 라우트에 일치하는 컴퍼넌트(인스턴스는 아니고 정의/생성자)의 배열을 반환합니다. 이는 주로 데이터를 프리페치(prefetching)하기 위해 서버 측 렌더링 동안 사용됩니다.

### router.resolve

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

- `append`는 `current` 라우트에 추가할 수 있도록 합니다 ([`router-link`](#router-link-props)처럼)

### router.addRoutes

  > 2.2.0+

  라우터에 동적으로 더 많은 라우트를 추가할 수 있습니다. 전달인자는 `routes` 생성자 옵션과 동일한 경로 설정 포맷을 사용하는 배열이어야 합니다.

### router.onReady

  > 2.2.0+

  이 메소드는 라우터가 초기 탐색을 완료할 때 호출하는 콜백을 대기시킵니다. 즉, 초기 라우트와 연결된 모든 비동기 입력 훅 및 비동기 컴포넌트를 해결합니다.

  이는 서버와 클라이언트 모두 일관된 출력을 보장하기 위해 서버측 렌더링을 사용할 때 유용합니다.

### router.onError

  > 2.4.0+

라우트 탐색 중에 에러가 발견되면 호출 될 콜백을 등록하십시오. 호출 할 에러에 유의하십시오. 에러는 다음 시나리오 중 하나이어야합니다.

  - 에러는 라우트 가드 기능 내에서 동기적으로 발생한 경우.
  - 에러는 라우트 가드 함수 내에서 `next(err)`를 호출하여 캐치한 경우
  - 라우트를 렌더링하는데 필요한 비동기 컴포넌트를 처리하려고 할 때 에러가 발생한 경우.

## 컴포넌트 주입

### 주입된 속성

이러한 프로퍼티는 라우터 인스턴스를 루트 인스턴스에 `router` 옵션으로 전달함으로써 모든 자식 컴포넌트에 주입됩니다.

- #### $router

  라우터 인스턴스

- #### $route

  현재 활성화 된 [Route](#the-route-object)입니다. 이 속성은 읽기 전용이며 해당 속성은 변경할 수는 없지만 감시 할 수 있습니다.

### 활성화된 옵션

  - beforeRouteEnter
  - beforeRouteUpdate
  - beforeRouteLeave

  [컴포넌트 내부 가드](../guide/advanced/navigation-guards.md#incomponent-guards)를 확인하세요.
