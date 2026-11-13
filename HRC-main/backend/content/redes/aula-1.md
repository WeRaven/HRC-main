**Tempo estimado de leitura:** 6 a 8 minutos

**Objetivo:** Compreender os conceitos fundamentais de redes de computadores, sua classificação quanto à abrangência geográfica e as vantagens do compartilhamento de recursos.

## Introdução

Isolado, um computador é uma unidade autônoma de processamento extremamente capaz, porém limitada ao escopo de seus próprios periféricos. Quando dois ou mais dispositivos são interconectados para trocar informações e recursos, forma-se uma rede de computadores. O surgimento das redes transformou a computação em um sistema global descentralizado e altamente colaborativo.

## Explicação detalhada dos conceitos

- **Definição formal de rede:** Um conjunto de dispositivos computacionais (nós) interconectados por links de comunicação (físicos ou sem fio) que utilizam um conjunto de regras padronizadas (protocolos) para compartilhar dados, serviços e periféricos.
- **Classificação por abrangência geográfica:**
  - **LAN (Local Area Network):** Rede restrita a um espaço geográfico delimitado, como uma residência, sala de aula ou edifício comercial. Apresenta altas taxas de transferência e baixíssima latência.
  - **MAN (Metropolitan Area Network):** Rede que abrange uma área metropolitana ou municipal, conectando, por exemplo, diferentes campi de uma universidade espalhados por uma cidade.
  - **WAN (Wide Area Network):** Rede de longa distância que cobre grandes regiões geográficas, como países ou continentes. A Internet é o maior exemplo público de WAN.
- **Benefícios do compartilhamento de recursos:**
  - **Recursos físicos:** Uso compartilhado de impressoras corporativas, armazenamento centralizado (NAS) e roteadores.
  - **Recursos lógicos:** Acesso a bancos de dados unificados, aplicações SaaS (Software as a Service) e servidores de autenticação centralizados.

## Exemplo prático / cenário do mundo real

Em um consultório médico com 5 salas de atendimento:

Sem rede, cada sala precisaria de uma impressora própria e os prontuários dos pacientes precisariam ser transportados em pen drives entre as salas. Com a implantação de uma LAN, todos os computadores conectam-se a uma única impressora de rede e acessam o servidor local de prontuários instantaneamente, de forma simultânea e segura.

## Resumo rápido

```
[ Dispositivo A ] <--- LAN (Rede Local) ---> [ Dispositivo B ]
        |                                          |
        +-------------> [ Roteador ] <-------------+
                              |
                        WAN (Internet)
                              |
                      [ Servidor Remoto ]
```

- **LAN:** Pequena extensão (casas, escritórios). Alta velocidade.
- **WAN:** Grande extensão (países, mundo). Conecta redes LANs entre si.
- **Recursos:** Compartilhamento centralizado para redução de custos e ganho operacional.
