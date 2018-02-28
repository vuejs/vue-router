# Injeções de componentes

### Propriedades Injetadas

Essas propriedades são injetadas em cada componente secundário, passando a instância do roteador para a instância raiz como a opção `router`.

- #### $router

   A instância do roteador.

- #### $route

   Atual ativa [Route](route-object.md). Esta propriedade é somente leitura e suas propriedades são imutáveis, mas podem ser vistas.

### Opções habilitadas

- ** beforeRouteEnter **
- ** beforeRouteUpdate ** (adicionado em 2.2)
- ** beforeRouteLeave **

Consulte [In Component Guards](../advanced/navigation-guards.md#incomponent-guards).