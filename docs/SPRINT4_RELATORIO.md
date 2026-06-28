# Sprint 4 - Evolucao Arquitetural e Padroes de Projeto

## Funcionalidades escolhidas

Foram escolhidas duas funcionalidades da Sprint 4:

1. Sistema de Tarifacao Flexivel
2. Central de Notificacoes

As duas funcionalidades foram escolhidas porque se encaixam diretamente no sistema de hospedagem ja existente. A tarifacao complementa o calculo de valores dos alugueis, enquanto a central de notificacoes permite avisar clientes e proprietarios quando eventos importantes acontecem.

## Funcionalidade 1: Sistema de Tarifacao Flexivel

### Problema identificado

Antes da evolucao, o valor total do aluguel era calculado diretamente a partir da diaria do quarto e da quantidade de dias. Caso fosse necessario adicionar alta temporada, baixa temporada, promocoes ou desconto para cliente frequente, o codigo de `Aluguel` precisaria ser alterado varias vezes.

Isso deixa o sistema menos extensivel e aumenta o risco de modificar regras antigas ao adicionar novas regras.

### Padrao utilizado

Foi utilizado o padrao Strategy.

Classes principais:

- `TarifaStrategy`
- `TarifaPadrao`
- `TarifaAltaTemporada`
- `TarifaBaixaTemporada`
- `DescontoClienteFrequente`
- `GerenciadorTarifas`

Cada regra de tarifacao implementa a interface `TarifaStrategy`. O aluguel nao precisa conhecer os detalhes de cada regra, apenas delega o calculo para o `GerenciadorTarifas`.

### Justificativa

O padrao Strategy foi escolhido porque permite trocar ou adicionar regras de calculo sem alterar a classe `Aluguel`. Assim, novas estrategias como feriados, eventos especiais e promocoes temporarias podem ser criadas de forma independente.

## Funcionalidade 2: Central de Notificacoes

### Problema identificado

O sistema precisava avisar usuarios quando eventos importantes ocorressem, como reserva criada ou reserva cancelada. Se cada controller enviasse diretamente e-mail, SMS ou WhatsApp, o codigo ficaria acoplado aos canais de comunicacao.

### Padroes utilizados

Foram utilizados Singleton e uma variacao simples de Observer/Strategy para canais de notificacao.

Classes principais:

- `GerenciadorNotificacoes`
- `CanalNotificacao`
- `CanalEmail`
- `CanalSms`
- `CanalWhatsapp`
- `Notificacao`
- `EventoNotificacao`

O `GerenciadorNotificacoes` mantem os canais registrados e dispara a mesma notificacao para todos eles. Cada canal implementa `CanalNotificacao`, permitindo incluir novos canais sem alterar a central.

### Justificativa

A central de notificacoes precisa coordenar eventos globais do sistema. Por isso, foi criada uma unica instancia compartilhada. Os canais foram separados por interface para reduzir acoplamento e permitir extensao.

## Uso obrigatorio de Singleton

O Singleton foi aplicado em:

- `GerenciadorTarifas`
- `GerenciadorNotificacoes`

O principal Singleton da sprint e o `GerenciadorNotificacoes`, pois representa um recurso global do sistema. A existencia de uma unica instancia evita duplicidade de historico e centraliza os canais registrados.

O `GerenciadorTarifas` tambem utiliza Singleton para manter uma configuracao global das regras de calculo aplicadas aos alugueis.

## Beneficios obtidos

- O sistema ficou mais extensivel.
- Novas tarifas podem ser adicionadas sem alterar `Aluguel`.
- Novos canais de notificacao podem ser adicionados sem alterar os controllers.
- As responsabilidades ficaram mais separadas.
- O codigo ficou mais alinhado aos principios de orientacao a objetos.
- Os testes unitarios demonstram o funcionamento das novas regras e do Singleton.

## Demonstracao de funcionamento

Foram adicionados testes automatizados em `Sprint4ArquiteturaTest`.

Os testes verificam:

- Aplicacao de tarifa de alta temporada.
- Troca para tarifa de baixa temporada sem alterar `Aluguel`.
- Existencia de uma unica instancia dos gerenciadores Singleton.
- Envio de notificacao para canal registrado.

Para executar:

```bash
mvn test
```
