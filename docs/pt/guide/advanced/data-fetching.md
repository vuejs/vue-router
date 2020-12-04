# Busca de Dados

Algumas vezes você precisa buscar dados no servidor quando a rota for ativada. Por exemplo, antes de renderizar o perfil do usuário, você precisa buscar os dados do usuário no servidor. Nós podemos realizar este feito, de duas maneiras diferentes:

- **Buscar Depois da Navegação**: realize a navegação primeiro, e busque os dados na chegada do gatilho do ciclo de vida do componente. Exiba um estado de carregamento enquanto os dados estiverem sendo requesitados.

- **Buscar Antes da Navegação**: busque os dados antes da navegação na sentinela de entrada da rota, e realize a navegação depois dos dados terem chegado.

Tecnicamente, ambos são escolhas validas - isto definitivamente depende da experiência do usuário que você pretende alcançar.

## Buscar Depois da Navegação

Quando usamos esta tecnica, nós navegamos e renderizamos o componente de chegada imediatamente, e buscamos os dados no gatilho `created` do componente. Ele dá-nos a oportunidade de exibir um estado de carregamento enquanto os dados estiverem sendo requesitados na rede, e nós também podemos manipular o carregamento diferentimente a cada visualização (view).

Vamos assumir que nós temos um componente `Post` que precise buscar os dados para uma publicação baseado no `$route.params.id`:

``` html
<template>
  <div class="post">
    <div v-if="loading" class="loading">
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
    // busque os dados quando a view tiver sido creada e os dados
    // já estiverem sendo observados.
    this.fetchData()
  },
  watch: {
    // Chame novamente o metódo se a rota mudar
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.error = this.post = null
      this.loading = true
      const fetchedId = this.$route.params.id
      // substituia `getPost` com a sua busca de dados / wrapper da API
      getPost(fetchedId, (err, post) => {
        // certifique-se que esta requesição seja a ultima que nós fizemos, ou então discarte-a
        if (this.$route.params.id !== fetchedId) return
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

## Buscar Antes da Navegação

Com esta tecnica nós buscamos os dados antes de navegar até a nova rota. Nós podemos realizar a busca dos dados na sentinela `beforeRouteEnter` no componente de chegada, e somente chamar o `next` quando a buscar estiver completa:

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
  // quando a rota mudar e este componente estiver renderizado,
  // a lógica será vagamente diferente.
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

O usuário irá estar na view anterior até os recursos terem sido completamente requesitados para view de chegada. Logo é recomendado exibir uma barra de progresso ou algo do tipo que sirva de indicador enquanto os dados estão sendo requesitados. Se a busca dos dados falhasr, é necessário também exibir algo que sirva como uma mensagem de alerta global.
