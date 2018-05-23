# Installation

### Téléchargement direct / CDN

[https://unpkg.com/vue-router/dist/vue-router.js](https://unpkg.com/vue-router/dist/vue-router.js)

<!--email_off-->
[Unpkg.com](https://unpkg.com) fournit des liens CDN basés sur npm. Le lien ci-dessus pointera toujours vers la dernière version sur npm. Vous pouvez aussi utiliser un tag ou une version spécifique via un URL comme `https://unpkg.com/vue-router@2.0.0/dist/vue-router.js`.
<!--/email_off-->

Incluez `vue-router` après Vue et l'installation sera automatique :

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vue-router.js"></script>
```

### npm

``` bash
npm install vue-router
```

Lorsqu'il est utilisé avec un système de module, vous devez explicitement installer le router via `Vue.use()` :

``` js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
```

Vous n'avez pas besoin de faire cela lors de l'utilisation des balises de script globales (`<script>`).

### Build de développement

Vous aurez besoin de cloner directement `vue-router` depuis GitHub et le compiler vous-même si vous souhaitez utiliser le dernier build de développement.

``` bash
git clone https://github.com/vuejs/vue-router.git node_modules/vue-router
cd node_modules/vue-router
npm install
npm run build
```
