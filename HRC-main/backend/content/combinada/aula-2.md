**Tempo estimado de leitura:** 6 a 8 minutos

**Objetivo:** Rastrear o ciclo de vida completo de um pacote de dados desde a placa de rede interna (hardware) até a transmissão no meio físico de rede.

## Introdução

Para que o software do seu computador interaja com um servidor remoto, o hardware local e os protocolos de rede precisam atuar de forma sincronizada. Nesta aula, unificaremos o conhecimento de hardware interno com a arquitetura de redes, acompanhando o exato instante em que a eletricidade dentro do processador transforma-se em um sinal modulado pronto para viajar pelo mundo.

## Explicação detalhada dos conceitos

- **Placa de interface de rede (NIC, Network Interface Card):** O componente de hardware responsável por intermediar o computador e o meio de rede. A NIC converte os dados digitais binários internos (bits 0 e 1) em sinais físicos:
  - **Sinais elétricos:** Em cabos de cobre UTP.
  - **Pulsos de luz:** Em cabos de fibra óptica.
  - **Ondas de rádio:** Em redes Wi-Fi.
- **O endereço MAC (Media Access Control):** Identificador físico gravado no chip de cada placa de rede em sua fabricação. Enquanto o endereço IP é um endereço lógico e alterável, o endereço MAC é único e imutável para aquele hardware.
- **Da CPU até a placa de rede (o barramento interno):**
  1. A CPU processa a requisição e a monta na RAM.
  2. Os dados trafegam pelo barramento PCIe da placa-mãe até a placa de rede (NIC).
  3. A NIC adiciona o endereço MAC de origem e o endereço MAC de destino, criando o frame de rede.
- **Resolução de endereços e roteamento:** O protocolo DNS (Domain Name System) traduz nomes legíveis (ex.: site.com) no endereço IP numérico do servidor. O pacote é então despachado para a rede externa via gateway padrão (roteador).

## Exemplo prático / cenário do mundo real

Ao clicar em "Enviar" em uma mensagem no computador corporativo:

- A CPU grava a mensagem na RAM.
- A mensagem é enviada via barramento da placa-mãe até a placa de rede (NIC).
- A NIC encapsula a mensagem com seu endereço MAC físico, transforma os bits em pulsos elétricos no cabo Ethernet e joga a informação para o comutador (switch) da empresa.
- O roteador lê o IP de destino e despacha o pacote para o provedor de internet.

## Resumo rápido

| Camada / Elemento | Identificador / Função | Onde atua |
|---|---|---|
| Placa de rede (NIC) | Converte bits em sinais físicos | Hardware interno |
| Endereço MAC | Endereço físico gravado na fábrica | Identificação local de hardware |
| Endereço IP | Endereço lógico na rede | Roteamento global na internet |
| DNS | Traduz URL para IP | Servidor de nomes na rede |
