# 설치

### 직접 다운로드 / CDN

[https://unpkg.com/vue-router/dist/vue-router.js](https://unpkg.com/vue-router/dist/vue-router.js)

<!--email_off-->
[Unpkg.com](https://unpkg.com)은 NPM 기반 CDN 링크를 제공합니다. 위의 링크는 항상 NPM의 최신 릴리스를 가리킵니다. `https://unpkg.com/vue-router@2.0.0/dist/vue-router.js`와 같이 URL을 통해 특정 버전 / 태그를 사용할 수도 있습니다.
<!--/email_off-->

Vue 다음에 `vue-router`를 포함하면 자동으로 설치됩니다.

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vue-router.js"></script>
```

### NPM

``` bash
npm install vue-router
```

모듈 시스템에서 사용하면 `Vue.use()`를 통해 명시적으로 라우터를 추가해야합니다.

``` js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
```

전역 스크립트 태그를 사용할 때는 이 작업을 하지 않아도 됩니다.

### 개발용 빌드

최신 dev 빌드를 사용하고 싶은 경우 GitHub에서 직접 복제하고 `vue-router`를 직접 빌드 해야 합니다.

``` bash
git clone https://github.com/vuejs/vue-router.git node_modules/vue-router
cd node_modules/vue-router
npm install
npm run build
```
