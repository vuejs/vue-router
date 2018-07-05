# Установка

## Скачивание напрямую / CDN

[https://unpkg.com/vue-router/dist/vue-router.js](https://unpkg.com/vue-router/dist/vue-router.js)

<!--email_off-->
[Unpkg.com](https://unpkg.com) предоставляет CDN-ссылки для NPM-пакетов. Ссылка выше всегда указывает на самую последнюю версию Vue-router на NPM. Вы можете также использовать конкретную версию, используя ссылки вида  `https://unpkg.com/vue-router@2.0.0/dist/vue-router.js`.
<!--/email_off-->

Подключите `vue-router` после Vue, и установка произойдёт автоматически:

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vue-router.js"></script>
```

## npm

``` bash
npm install vue-router
```

При использовании модульной системы, необходимо явно обозначить использование роутера при помощи `Vue.use()`:

``` js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
```

Это не требуется при подключении через глобальный тег `script`.

## Версия для разработки

Если вы хотите использовать самую новую dev-сборку `vue-router`, то придётся вручную склонировать репозиторий с GitHub и запустить сборку:

``` bash
git clone https://github.com/vuejs/vue-router.git node_modules/vue-router
cd node_modules/vue-router
npm install
npm run build
```
