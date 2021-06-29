
# Router 實例

### 屬性

#### router.app

- 類型: `Vue instance`

  配置了 `router` 的 Vue 根實例。

#### router.mode

- 類型: `string`

  路由使用的[模式](options.md#mode)。

#### router.currentRoute

- 類型: `Route`

  當前路由對應的[路由信息對象](route-object.md)。

### 方法

- **router.beforeEach(guard)**
- **router.beforeResolve(guard) (2.5.0+)**: 此時非同步組件已經加載完成
- **router.afterEach(hook)**

  增加全局的導航守衛。參考[導航守衛](../advanced/navigation-guards.md)。

  在 2.5.0+ 這三個方法都返回一個移除已註冊的守衛/鈎子的函數。

- **router.push(location, onComplete?, onAbort?)**
- **router.replace(location, onComplete?, onAbort?)**
- **router.go(n)**
- **router.back()**
- **router.forward()**

  動態的導航到一個新 URL。參考[編程式導航](../essentials/navigation.md)。

- **router.getMatchedComponents(location?)**

  返回目標位置或是當前路由匹配的組件數組（是數組的定義/構造類，不是實例）。通常在服務端渲染的數據預加載時時候。

- **router.resolve(location, current?, append?)**

  > 2.1.0+

  解析目標位置（格式和 `<router-link>` 的 `to` prop 一樣），返回包含如下屬性的對象：

  ``` js
  {
    location: Location;
    route: Route;
    href: string;
  }
  ```

  - `current` 是當前默認的路由 (通常你不需要改變它)
  - `append` 允許你在 `current` 路由上附加路徑 (如同 [`router-link`](router-link.md#props))

- **router.addRoutes(routes)**

  > 2.2.0+

  動態添加更多的路由規則。參數必須是一個符合 `routes` 選項要求的數組。

- **router.onReady(callback, [errorCallback])**

  > 2.2.0+

  該方法把一個回調排隊，在路由完成初始導航時調用，這意味著它可以解析所有的非同步進入鈎子和路由初始化相關聯的非同步組件。

  這可以有效確保服務端渲染時服務端和客戶端輸出的一致。

  第二個參數 `errorCallback` 只在 2.4+ 支持。它會在初始化路由解析運行出錯 (比如解析一個非同步組件失敗) 時被調用。

- **router.onError(callback)**

  > 2.4.0+

  註冊一個回調，該回調會在路由導航過程中出錯時被調用。注意被調用的錯誤必須是下列情形中的一種：

  - 錯誤在一個路由守衛函數中被同步拋出；

  - 錯誤在一個路由守衛函數中通過調用 `next(err)` 的方式非同步捕獲並處理；

  - 渲染一個路由的過程中，需要嘗試解析一個非同步組件時發生錯誤。

