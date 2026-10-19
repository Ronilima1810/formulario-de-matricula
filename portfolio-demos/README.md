# Portfólio de sistemas — Roni Lima

Este diretório contém uma **vitrine estática**, publicada pelo GitHub Pages, com demonstrações independentes de produtos de software.

**[Abrir a vitrine de sistemas](https://ronilima1810.github.io/formulario-de-matricula/portfolio-demos/)**

## Demonstrações

| Produto | Objetivo | Preview |
|---|---|---|
| Ruby BI | Inteligência logística, faturamento, frete, expedição e indicadores | [Abrir](https://ronilima1810.github.io/formulario-de-matricula/portfolio-demos/?demo=bi) |
| FleetOps | Administração independente de frota e agregados: motoristas, veículos, rotas e remuneração | [Abrir](https://ronilima1810.github.io/formulario-de-matricula/portfolio-demos/?demo=frota) |
| Order Control Center | Torre de Pedidos com workflow, aging, separação e faturamento | [Abrir](https://ronilima1810.github.io/formulario-de-matricula/portfolio-demos/?demo=pedidos) |
| Loja de Pedidos | Simulação separada do projeto público PHP de comércio eletrônico | [Abrir](https://ronilima1810.github.io/formulario-de-matricula/portfolio-demos/?demo=loja) |
| Tradutor | Protótipo web de aplicação desktop Python | [Abrir](https://ronilima1810.github.io/formulario-de-matricula/portfolio-demos/?demo=tradutor) |

## Arquitetura da vitrine

- `index.html` — ponto de entrada, com política de conteúdo restritiva (CSP).
- `assets/ruby-showcase.css` — sistema visual demonstrativo inspirado no design system Ruby, com Manrope, temas claro/escuro, painéis e sidebar.
- `assets/ruby-showcase.js` — dados fictícios, navegação, filtros, painéis e interações inteiramente locais.
- `assets/style.css` e `assets/app.js` — primeira versão, preservada apenas como referência histórica.

## Produtos e limites

**Ruby BI:** plataforma de análises com organização visual baseada no Ruby Tower Control. Esta vitrine não representa o backend de produção e não contém lógica de negócio proprietária.

**FleetOps:** produto independente para administração de frota/agregados. Exemplo de cálculo: valor da saída + `max(0, km rodados - km de franquia) × adicional por km` + valor de ajudante (quando aplicável). Não registra negociações nem pagamentos.

**Order Control Center:** apresentação de uma torre operacional de pedidos com fluxos inspirados em processos logísticos. Não acessa dados reais do Ruby.

**Loja de Pedidos:** não deve ser confundida com a Torre de Pedidos. Seu repositório público original é [sistema-pedidos](https://github.com/Ronilima1810/sistema-pedidos).

## Segurança

Todas as demonstrações são **offline-first, estáticas e com dados inventados**. Não há integração com banco de dados, endpoints corporativos, tracking GPS, autenticação real, dados pessoais ou credenciais. Exportações CSV contêm somente informações de demonstração.

## Publicação

O GitHub Pages do repositório `formulario-de-matricula` já fornece a página em `/portfolio-demos/`. Os arquivos de produção do sistema Ruby e dos aplicativos Android não foram modificados.
