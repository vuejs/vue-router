# Obtención de datos

Puede que necesite obtener datos desde el servidor cuando una ruta es activada. Por ejemplo, antes de renderizar un perfil de usuario, puede obtener la información de ese usuario desde el servidor. Podemos lograr esto de dos maneras diferentes:

- **Obtener la información después de la navegación**: realice la navegación primero y luego obtenga los datos en el _hook_ del ciclo de vida del componente entrante. Muestre algún tipo de indicador de carga mientras espera llegada de la información.

- **Obtener la información antes de la navegación**: Obtenga los datos antes de la navegación en el guardia de entrada de la ruta, y realice la navegación luego de haberla obtenido.

Técnicamente, ambas opciones son válidas - depende de la experiencia de usuario a la que apunte.

## Obtener la información después de la navegación

Cuando utilizamos este enfoque, navegamos y renderizamos el componente entrante inmediatamente, y obtenemos los datos en el _hook_ `create` del componente. Nos posibilita mostrar un indicador de estado de carga mientras se obtiene la información a través de la red, y también podemos manejar la carga de datos de manera diferente para cada vista.

Asumamos que tenemos un componente `Post` que necesita obtener datos de un _post_ basándose en `$route.params.id`:

``` html
<template>
  <div class="post">
    <div class="loading" v-if="loading">
      Loading...
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="post" class="content">
      <h2>{{ post.title }}</h2>
      <p>{{ post.body }}</p>
    </div>
  </div>
</template>
```

``` js
export default {
  data () {
    return {
      loading: false,
      post: null,
      error: null
    }
  },
  created () {
    // obtener los datos cuando la vista es creada y _data_ ya
    // está siendo observada
    this.fetchData()
  },
  watch: {
    // ejecutar nuevamente el método si la ruta cambia
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.error = this.post = null
      this.loading = true
      // reemplace getPost con lo que corresponda
      getPost(this.$route.params.id, (err, post) => {
        this.loading = false
        if (err) {
          this.error = err.toString()
        } else {
          this.post = post
        }
      })
    }
  }
}
```

## Obtener la información antes de la navegación

Con este enfoque, obtenemos la información antes de navegar a la nueva ruta. Podemos obtener los datos en el guardia `beforeRouteEnter` en el componente entrante, y solo ejecutar `next` cuando se haya completado:

``` js
export default {
  data () {
    return {
      post: null,
      error: null
    }
  },
  beforeRouteEnter (to, from, next) {
    getPost(to.params.id, (err, post) => {
      if (err) {
        // mostrar algún mensaje global de error
        next(false)
      } else {
        next(vm => {
          vm.post = post
        })
      }
    })
  },
  // cuando la ruta cambie y este componente ya haya sido renderizado,
  // la lógica será ligeramente diferente
  watch: {
    $route () {
      this.post = null
      getPost(this.$route.params.id, (err, post) => {
        if (err) {
          this.error = err.toString()
        } else {
          this.post = post
        }
      })
    }
  }
}
```

El usuario permanecerá en la vista actual mientras se esté obteniendo el recurso para la vista entrante. Por lo tanto, es recomendable mostrar algún tipo de indicador o barra de progreso. Si la obtención de datos falla, es necesario mostrar algún tipo de mensaje global de advertencia.
