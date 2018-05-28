# 라우터 생성자 옵션

### routes

- 자료형: `Array<RouteConfig>`

  `RouteConfig`에 대한 자료형 선언:

  ``` js
  declare type RouteConfig = {
    path: string;
    component?: Component;
    name?: string; // 이름을 가진 라우트를 위함
    components?: { [name: string]: Component }; // 이름을 가진 뷰를 위함
    redirect?: string | Location | Function;
    alias?: string | Array<string>;
    children?: Array<RouteConfig>; // 중첩된 라우트를 위함 routes
    beforeEnter?: (to: Route, from: Route, next: Function) => void;
    meta?: any;
  }

  // 2.6.0+
  caseSensitive?: boolean; // 대소문자를 구분합니까? (default: false)
  pathToRegexpOptions?: Object; // path-to-regexp 옵션은 정규 표현식을 컴파일합니다.
  ```

### mode

- 자료형: `string`

- 기본값: `"hash" (in browser) | "abstract" (in Node.js)`

- 유효 값: `"hash" | "history" | "abstract"`

  라우터 모드에 대한 설정입니다.

  - `hash`: 라우팅에 URL 해시를 사용합니다. HTML5 기록 API를 지원하지 않는 브라우저를 포함하여 모든 Vue 지원 브라우저에서 작동합니다.

  - `history`: HTML5 히스토리 API 및 서버 설정이 필요합니다. [HTML5 History 모드](../essentials/history-mode.md)를 확인하세요.

  - `abstract`:   모든 자바 스크립트 환경에서 작동합니다 (예: Node.js가 있는 서버 측 **브라우저 API가없는 경우 라우터가 자동으로이 모드로 강제 전환됩니다.**

### base

- 자료형: `string`

- 기본값: `"/"`

  앱의 기본 URL입니다. 예를 들어, 전체 단일 페이지 응용 프로그램이 `/app/`하에 제공된다면`base`는 `"/app/"` 값을 사용해야합니다.

### linkActiveClass

- 자료형: `string`

- 기본값: `"router-link-active"`

  전역의 `<router-link>` 기본 active 클래스를 설정하십시오. [router-link](router-link.md)를 확인하세요.

### linkExactActiveClass

> 2.5.0+

- 자료형: `string`

- 기본값: `"router-link-exact-active"`

 전역으로 `<router-link>`에서 사용할  정확하게 일치하는 경우의 클래스를 설정할 수 있습니다. [router-link](router-link.md)를 확인하세요.

### scrollBehavior

- 자료형: `Function`

  서명:

  ```
  (
    to: Route,
    from: Route,
    savedPosition?: { x: number, y: number }
  ) => { x: number, y: number } | { selector: string } | ?{}
  ```

  [Scroll 동작](../advanced/scroll-behavior.md)를 확인하세요.

### parseQuery / stringifyQuery

> 2.4.0+

- 자료형: `Function`

  사용자 지정 쿼리 문자열 구문 분석/문자열화 함수를 사용할 수 있습니다. 기본 값을 오버라이드합니다.

### fallback

  > 2.6.0+

  - 자료형: `boolean`

   브라우저가 `history.pushState`를 지원하지 않을 때 라우터가 `hash`모드로 변경되어야 할지 설정합니다. 기본값은 `true`입니다.

   이를 `false`로 설정하면 IE9에서 모든 `router-link`를 탐색 할 수 있습니다. 이것은 해시모드 URL이 SSR에서 작동하지 않기 때문에 앱이 서버에서 렌더링되어 IE9에서 작동해야하는 경우에 유용합니다.
