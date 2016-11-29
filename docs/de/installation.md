# Installation

### Direkter Download / CDN

[https://unpkg.com/vue-router](https://unpkg.com/vue-router)

<!--email_off-->
[Unpkg.com](https://unpkg.com) bietet NPM-basierte CDN-Links an. Der obige Link führt immer zur aktuellsten Version auf NPM. Eine bestimmte Version kann via URL genutzt werden: `https://unpkg.com/vue-router@2.0.0`.
<!--/email_off-->

Füge `vue-router` nach Vue ein und es installiert sich selbst automatisch:

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vue-router.js"></script>
```

### NPM

``` bash
npm install vue-router
```

Wenn mit einem Modulsystem genutzt, muss der Router explizit via `Vue.use()` installiert werden:

``` js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
```

Das muss nicht getan werden, wenn globale Skript-Tags genutzt werden.

### Dev Build

Die Repo muss direkt von GitHub geklont und `vue-router`-Build selbst erstellt werden, wenn die aktuelle Dev-Version gewünscht ist.


``` bash
git clone https://github.com/vuejs/vue-router.git node_modules/vue-router
cd node_modules/vue-router
npm install
npm run build
```
