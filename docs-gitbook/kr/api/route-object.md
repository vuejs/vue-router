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
