# Installation

### Direkter Download / CDN

[https://unpkg.com/vue-router](https://unpkg.com/vue-router)

<!--email_off-->
[Unpkg.com](https://unpkg.com) bietet NPM-basierte CDN-Links an. Der obige Link führt immer zur aktuellsten Version auf NPM. Eine genaue Version kann via URL genutzt werden: `https://unpkg.com/vue-router@2.0.0`.
<!--/email_off-->

Füge `vue-router` nach Vue ein und es installiert sich automatisch selbst:

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vue-router.js"></script>
```

### NPM

``` bash
npm install vue-router
```

Wenn ein Module-System genutzt wird (z.B. Webpack, Browserify), muss der Router explizit via `Vue.use()` installiert werden:

``` js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
```

Wenn globale Skript-Tags genutzt werden ist das nicht notwendig.

### Dev Build (Entwicklungs-Version)

Wenn die aktuelle Dev-Version genutzt werden soll, muss das Repository direkt von GitHub geklont und die aktuelle `vue-router`-Build selbst erstellt werden, .


``` bash
git clone https://github.com/vuejs/vue-router.git node_modules/vue-router
cd node_modules/vue-router
npm install
npm run build
```
