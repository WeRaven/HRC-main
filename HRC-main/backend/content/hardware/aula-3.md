**Tempo estimado de leitura:** 6 a 8 minutos

**Objetivo:** Capacitar o estudante a interpretar fichas técnicas de hardware e tomar decisões fundamentadas de compra ou upgrade.

## Introdução

Ao ler a descrição comercial de um computador, o profissional de TI depara-se com uma profusão de siglas e números, como "i7 3.8 GHz", "16 GB DDR5", "1 TB NVMe PCIe 4.0". Interpretar corretamente essas métricas é crucial para avaliar a capacidade real de processamento de um equipamento e estimar sua adequação às demandas de software.

## Explicação detalhada dos conceitos

- **Frequência da CPU (clock em GHz):** Indica a quantidade de ciclos de clock que o processador consegue executar por segundo. 1 GHz = 1 bilhão de ciclos por segundo. Uma frequência base mais alta significa maior velocidade na execução de instruções unitárias.
- **Núcleos (cores) e threads:**
  - **Núcleos físicos:** Unidades de processamento independentes fabricadas no mesmo chip de silício.
  - **Threads:** Divisões lógicas do núcleo (via tecnologias como Hyper-Threading), permitindo que um mesmo núcleo físico gerencie duas sequências de tarefas simultaneamente.
- **Gerações e tecnologias de memória RAM (DDR4 vs. DDR5):** A sigla DDR (Double Data Rate) indica a geração tecnológica da memória. Gerações mais novas (DDR5) entregam frequências de operação maiores, maior largura de banda e menor consumo de energia em relação a gerações anteriores (DDR4).
- **Taxas de leitura e escrita de armazenamento (MB/s):**
  - HD mecânico SATA: cerca de 100 a 150 MB/s.
  - SSD SATA III: cerca de 500 a 550 MB/s.
  - SSD NVMe (PCIe 4.0): cerca de 3500 a 7500 MB/s.
- **Soquete e compatibilidade física:** O soquete é o encaixe físico da CPU na placa-mãe. Processadores das marcas Intel e AMD possuem padrões de soquete específicos (ex.: LGA 1700, AM5) que exigem placas-mãe estritamente compatíveis.

## Exemplo prático / cenário do mundo real

Avaliando duas propostas para um escritório de arquitetura que executa softwares de modelagem 3D e renderização:

- **Opção A:** CPU quad-core 2.0 GHz, 8 GB RAM DDR4, HD 1 TB.
- **Opção B:** CPU octa-core (16 threads) 3.6 GHz, 32 GB RAM DDR5, SSD NVMe 1 TB.

A Opção A causará atrasos severos na renderização por falta de núcleos para cálculo paralelo, lentidão na abertura de arquivos pelo HD e travamentos ao manipular modelos complexos devido à limitação de RAM. A Opção B atende com margem aos requisitos técnicos do software.

## Resumo rápido

| Métrica | O que mede | Impacto prático |
|---|---|---|
| GHz (clock) | Ciclos por segundo | Velocidade de resposta em tarefas individuais |
| Núcleos/Threads | Processadores paralelos | Desempenho em multitarefa e renderização |
| GB de RAM | Capacidade da mesa de trabalho | Suporte a programas pesados simultâneos |
| MB/s (SSD) | Velocidade de transferência | Rapidez ao ligar o PC e carregar programas |
| Soquete | Formato de conexão física | Define a compatibilidade entre CPU e placa-mãe |
