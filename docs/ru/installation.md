# Установка

### Локальный файл / CDN

[https://unpkg.com/vue-router/dist/vue-router.js](https://unpkg.com/vue-router/dist/vue-router.js)

[Unpkg.com](https://unpkg.com) предоставляет CDN-ссылки для NPM-пакетов. Ссылка выше всегда указывает на самую свежую версию vue-router, доступную в NPM. Можно указать и конкретную версию или тег, используя ссылки вида `https://unpkg.com/vue-router@2.0.0/dist/vue-router.js`.

Подключите `vue-router` после Vue, и установка произойдёт автоматически:

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vue-router.js"></script>
```

### NPM

``` bash
npm install vue-router
```

При использовании модульной системы сборки, необходимо явно обозначить использование роутера при помощи `Vue.use()`:

``` js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
```

При использовании глобальных скриптов в этом нет необходимости.

### Dev-Сборка

Если вы хотите использовать версию `vue-router` в разработке, склонируйте репозиторий с GitHub и выполните сборку вручную:

``` bash
git clone https://github.com/vuejs/vue-router.git node_modules/vue-router
cd node_modules/vue-router
npm install
npm run build
```
