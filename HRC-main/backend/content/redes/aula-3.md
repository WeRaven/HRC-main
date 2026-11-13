**Tempo estimado de leitura:** 6 a 8 minutos

**Objetivo:** Identificar os meios de transmissão e os equipamentos físicos de rede, além de compreender os fundamentos da navegação criptografada e segurança.

## Introdução

A comunicação em rede necessita de uma infraestrutura física de transporte, seja ela cabeada ou sem fio. Paralelamente, como os dados trafegam por meios públicos ou compartilhados, a aplicação de medidas de segurança e criptografia é essencial para impedir a interceptação e o acesso não autorizado a informações confidenciais.

## Explicação detalhada dos conceitos

- **Meios de transmissão guiados vs. não guiados:**
  - **Cabo Ethernet (UTP, par trançado / RJ45):** Meio guiado físico. Garante altíssima estabilidade, imunidade a interferências de sinal por obstáculos e baixíssima latência. É a escolha ideal para estações de trabalho fixas e servidores.
  - **Wi-Fi (ondas de rádio / padrão IEEE 802.11):** Meio não guiado. Proporciona mobilidade para smartphones e laptops, mas está sujeito a atenuação por paredes, interferência magnética e variação de alcance.
- **Diferenciação de hardware: modem vs. roteador:**
  - **Modem (modulador/demodulador):** Converte os sinais analógicos fornecidos pelo provedor (fibra óptica, cabo coaxial) em dados digitais que o computador compreende.
  - **Roteador:** Recebe o sinal digital do modem e cria a rede local (LAN), distribuindo endereços IP internos e controlando o tráfego entre todos os aparelhos da casa ou empresa.
- **Segurança de rede e criptografia (HTTPS):**
  - **Autenticação Wi-Fi (WPA2/WPA3):** Algoritmos de segurança que exigem senha e criptografam o tráfego de rádio entre o dispositivo e o ponto de acesso.
  - **HTTPS (HyperText Transfer Protocol Secure):** Protocolo de aplicação que utiliza criptografia (TLS/SSL). Mesmo que um invasor intercepte os pacotes trafegando na rede, verá apenas um emaranhado de caracteres ilegíveis, protegendo senhas e dados bancários.

## Exemplo prático / cenário do mundo real

Você está trabalhando em uma cafeteria conectada a uma rede Wi-Fi aberta (sem senha):

- **Cenário A (acesso via HTTP, sem cadeado):** Um invasor na mesma rede sem fio pode utilizar um software de captura de pacotes (packet sniffer) e visualizar a senha que você digitou em texto puro.
- **Cenário B (acesso via HTTPS, com cadeado):** Embora o sinal de rádio seja capturado, a criptografia do HTTPS garante que os dados viajem ilegíveis, impedindo a leitura do conteúdo.

## Resumo rápido

- **Ethernet (cabo):** Velocidade e estabilidade máximas.
- **Wi-Fi:** Conveniência e mobilidade, sujeito a interferências físicas.
- **Modem:** Traduz o sinal externo do provedor.
- **Roteador:** Distribui a conexão para a rede local.
- **HTTPS:** Garante que a comunicação entre o seu navegador e o site seja criptografada ponta a ponta.
