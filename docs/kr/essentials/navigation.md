# 프로그래밍 방식 네비게이션

`<router-link>`를 사용하여 선언적 네비게이션용 anchor 태그를 만드는 것 외에도 라우터의 인스턴스 메소드를 사용하여 프로그래밍으로 이를 수행 할 수 있습니다.

#### `router.push(location)`

다른 URL로 이동하려면 `router.push`를 사용하십시오. 이 메소드는 새로운 항목을 히스토리 스택에 넣기 때문에 사용자가 브라우저의 뒤로 가기 버튼을 클릭하면 이전 URL로 이동하게된다.

이것은 `<router-link>`를 클릭 할 때 내부적으로 호출되는 메소드이므로 `<router-link :to="...">`를 클릭하면 `router.push(...)`를 호출하는 것과 같습니다.

| 선언적 방식 | 프로그래밍 방식 |
|-------------|--------------|
| `<router-link :to="...">` | `router.push(...)` |

전달인자는 문자열 경로 또는 로케이션 디스크립터 객체가 될 수 있습니다.

예:

``` js
// 리터럴 string
router.push('home')

// object
router.push({ path: 'home' })

// 이름을 가지는 라우트
router.push({ name: 'user', params: { userId: 123 }})

// 쿼리와 함께 사용, 결과는 /register?plan=private 입니다.
router.push({ path: 'register', query: { plan: 'private' }})
```

#### `router.replace(location)`

`router.push`와 같은 역할을 하지만 유일한 차이는 새로운 히스토리 항목에 추가하지 않고 탐색한다는 것입니다. 이름에서 알 수 있듯이 현재 항목을 대체합니다.

| 선언적 방식   | 프로그래밍 방식 |
|-------------|--------------|
| `<router-link :to="..." replace>` | `router.replace(...)` |


#### `router.go(n)`

이 메소드는 `window.history.go(n)`와 비슷하게 히스토리 스택에서 앞으로 또는 뒤로 이동하는 단계를 나타내는 하나의 정수를 매개 변수로 사용합니다.

예제

``` js
// 한 단계 앞으로 갑니다. history.forward()와 같습니다. history.forward()와 같습니다.
router.go(1)

// 한 단계 뒤로 갑니다. history.back()와 같습니다.
router.go(-1)

// 3 단계 앞으로 갑니다.
router.go(3)

// 지정한 만큼의 기록이 없으면 자동으로 실패 합니다.
router.go(-100)
router.go(100)
```

#### History 조작

`router.push`, `router.replace` 및 `router.go`는 [`window.history.pushState`,`window.history.replaceState` 및 `window.history.go`](https://developer.mozilla.org/en-US/docs/Web/API/History)와 상응합니다. 그들은 `window.history` API를 모방합니다.

따라서 [브라우저 히스토리 API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)에 이미 익숙하다면 vue-router를 사용하여 히스토리를 손쉽게 조작 할 수 있습니다.

vue-router 네비게이션 메소드(`push`,`replace`,`go`)는 모든 라우터 모드(`history`,`hash` 및`abstract`)에서 일관되게 작동합니다.
