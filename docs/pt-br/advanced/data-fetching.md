# Data Fetching

Às vezes, você precisa buscar dados do servidor quando uma rota é ativada. Por exemplo, antes de renderizar um perfil de usuário, você precisa buscar os dados do usuário do servidor. Podemos alcançar isso de duas maneiras diferentes:

- **Recuperação após navegação**: execute a navegação primeiro e obtenha dados no gancho do ciclo de vida do componente recebido. Exibir um estado de carregamento enquanto os dados estão sendo buscados.

- **Recolher antes da navegação**: Obter dados antes da navegação na rota entrar no guarda e executar a navegação após a obtenção dos dados.

Tecnicamente, ambas são opções válidas - em última análise, depende da experiência do usuário que você está buscando.

## Após a navegação

Ao usar essa abordagem, navegamos e renderizamos o componente de entrada imediatamente e buscamos dados no gancho `created` do componente. Isso nos dá a oportunidade de exibir um estado de carregamento enquanto os dados estão sendo buscados através da rede, e também podemos lidar com o carregamento de forma diferente para cada visualização.

Vamos supor que temos um componente `Post` que precisa buscar os dados para uma postagem com base em `$ route.params.id`:

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
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.error = this.post = null
      this.loading = true
      // replace `getPost` with your data fetching util / API wrapper
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

## Preparando antes da navegação

Com essa abordagem, buscamos os dados antes de navegar para o novo
rota. Podemos executar a busca de dados no protetor `beforeRouteEnter` no componente de entrada e apenas chamar `next` quando a conclusão for concluída:

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
  // when route changes and this component is already rendered,
  // the logic will be slightly different.
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

O usuário permanecerá na visualização anterior enquanto o recurso estiver sendo buscado para a exibição recebida. Portanto, é recomendável exibir uma barra de progresso ou algum tipo de indicador enquanto os dados estão sendo buscados. Se a busca de dados falhar, também é necessário exibir algum tipo de mensagem de aviso global.