# Obtención de datos

A veces es necesario obtener datos del servidor cuando una ruta es activada. Por ejemplo, antes de renderizar un perfil de usuario, puedes obtener la información de ese usuario desde el servidor. Podemos lograr esto de dos maneras diferentes:

- **Obtener la información después de la navegación**: realiza la navegación primero y luego obtén los datos en un _hook_ del ciclo de vida del componente entrante. Puedes mostrar un indicador de carga mientras se obtienen los datos.

- **Obtener la información antes de la navegación**: Obtén los datos antes de la navegación en la guardia de entrada de la ruta, y realiza la navegación una vez estos obtenidos.

Técnicamente, ambas opciones son válidas - todo depende de la experiencia de usuario a la que apuntes.

## Obtener la información después de la navegación

Cuando utilizamos este enfoque, navegamos y renderizamos el componente entrante inmediatamente, y obtenemos los datos en el _hook_ `created` del componente. Esto nos permite mostrar un indicador de estado de carga mientras se obtiene la información desde un servidor remoto, y también manejar la carga de datos según la ruta.

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
    // obtén los datos cuando la vista es creada y _data_ ya
    // está siendo observada
    this.fetchData()
  },
  watch: {
    // ejecuta nuevamente el método si la ruta cambia
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.error = this.post = null
      this.loading = true
      // reemplaza getPost con lo que corresponda
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

Con este enfoque, obtenemos la información antes de navegar a la nueva ruta. Podemos obtener los datos en el guardia `beforeRouteEnter` del componente entrante, y solo ejecutar `next` cuando se haya completado:

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
      next(vm => vm.setData(err, post))
    })
  },
  // cuando la ruta cambie y este componente ya haya sido renderizado,
  // la lógica será ligeramente diferente
  beforeRouteUpdate (to, from, next) {
    this.post = null
    getPost(to.params.id, (err, post) => {
      this.setData(err, post)
      next()
    })
  },
  methods: {
    setData (err, post) {
      if (err) {
        this.error = err.toString()
      } else {
        this.post = post
      }
    }
  }
}
```

El usuario permanecerá en la vista anterior mientras se esté obteniendo el recurso para la vista entrante. Por lo tanto, es recomendable mostrar algún tipo de indicador o barra de progreso. Si la obtención de datos falla, es necesario mostrar algún tipo de advertencia global.
