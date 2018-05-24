# 컴포넌트 주입

### 주입된 속성

이러한 프로퍼티는 라우터 인스턴스를 루트 인스턴스에 `router` 옵션으로 전달함으로써 모든 자식 컴포넌트에 주입됩니다.

- #### $router

  라우터 인스턴스

- #### $route

  현재 활성화 된 [Route](route-object.md)입니다. 이 속성은 읽기 전용이며 해당 속성은 변경할 수는 없지만 감시 할 수 있습니다.

### 활성화된 옵션

- **beforeRouteEnter**
- **beforeRouteUpdate** (2.2에서 추가됨)
- **beforeRouteLeave**

  [컴포넌트 내부 가드](../advanced/navigation-guards.md#incomponent-guards)를 확인하세요.
