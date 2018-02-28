# A Instância da Rota

### Propriedades

#### router.app

- type: `Vue instance`

  A instância do root Vue, o `router` oi injetado.

#### router.mode

- type: `string`

  O [modo](options.md#mode) que o roteador está usando.

#### router.currentRoute

- type: `Route`

  A rota atual representada como um [objeto de rota](route-object.md).

### Métodos

- **router.beforeEach(guard)**
- **router.beforeResolve(guard)** (2.5.0+)
- **router.afterEach(hook)**

  Adicione guardas de navegação globais. Veja [Navigation Guards](../advanced/navigation-guards.md).

  Em 2.5.0+ Todos os três métodos retornam uma função que remove o registro.

- **router.push(location, onComplete?, onAbort?)**
- **router.replace(location, onComplete?, onAbort?)**
- **router.go(n)**
- **router.back()**
- **router.forward()**

  Navegue programaticamente para um novo URL. Veja[Programmatic Navigation](../essentials/navigation.md).

- **router.getMatchedComponents(location?)**

  Retorna uma matriz dos componentes (definição/construtor, não instâncias) correspondente ao local fornecido ou à rota atual. Isso é usado principalmente durante a renderização do lado do servidor para executar a pré-busca de dados.

- **router.resolve(location, current?, append?)**

  > 2.1.0+

  Reverter a resolução de URL. Dada a localização na forma idêntica à utilizada em `<router-link />`, retorna o objeto com as seguintes propriedades resolvidas:

  ``` js
  {
    location: Location;
    route: Route;
    href: string;
  }
  ```

  - `current` é a Rota atual por padrão (na maioria das vezes você não precisa mudar isso)
  - `append` permite que você adicione o caminho à rota `current` route (como com [`router-link`](router-link.md#props))

- **router.addRoutes(routes)**

  > 2.2.0+

  Adicione dinamicamente mais rotas ao roteador. O argumento deve ser uma matriz usando o mesmo formato de configuração de rota com a opção de construtor `routes`.

- **router.onReady(callback, [errorCallback])**

  > 2.2.0+

  Este método coloca uma chamada de retorno para ser chamado quando o roteador completou a navegação inicial, o que significa que ele resolveu todos os segmentos de entrada assíncronos e os componentes assíncronos associados à rota inicial.

  Isso é útil na renderização do lado do servidor para garantir uma saída consistente no servidor e no cliente.

  O segundo argumento `errorCallback` é suportado apenas em 2.4+. Será chamado quando a resolução de rota inicial for executada em um erro (por ex., não conseguiu resolver um componente assíncrono).

- **router.onError(callback)**

  > 2.4.0+

  Registre um retorno de chamada que será chamado quando um erro for detectado durante uma navegação de rota. Observação para um erro ser chamado, ele deve ser um dos seguintes cenários:

  - O erro é lançado de forma síncrona dentro de uma função de guarda de rota;

  - O erro é capturado e tratado de forma assíncrona ao chamar `next(err)` dentro de uma função de guarda de rota;

  - Ocorreu um erro ao tentar resolver um componente assíncrono necessário para renderizar uma rota.