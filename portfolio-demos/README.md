# Portfólio de sistemas — Roni Lima

Este diretório contém uma **vitrine estática**, publicada pelo GitHub Pages, com demonstrações independentes de produtos de software.

**[Abrir a vitrine de sistemas](https://ronilima1810.github.io/formulario-de-matricula/portfolio-demos/)**

## Demonstrações

| Produto | Objetivo | Preview |
|---|---|---|
| Ruby BI | Inteligência logística, faturamento, frete, expedição e indicadores | [Abrir](https://ronilima1810.github.io/formulario-de-matricula/portfolio-demos/ruby/) |
| FleetOps | Administração independente de frota e agregados: motoristas, veículos, rotas e remuneração | [Abrir](https://ronilima1810.github.io/formulario-de-matricula/portfolio-demos/fleet/) |
| Order Control Center | Torre de Pedidos com workflow, aging, separação e faturamento | [Abrir](https://ronilima1810.github.io/formulario-de-matricula/portfolio-demos/ruby/?module=pedidos) |
| **FleetOps Android** | Simulador web interativo baseado nos componentes Kotlin / Compose, com rotas e histórico fictícios | [Abrir](https://ronilima1810.github.io/formulario-de-matricula/portfolio-demos/android/) |
| Lumus PDV Desktop | Cliente Electron de demonstração, com interface ERP, caixa, estoque e relatórios | [Abrir](https://ronilima1810.github.io/formulario-de-matricula/portfolio-demos/pdv/) |
| Tradutor | Protótipo web de aplicação desktop Python | [Abrir](https://ronilima1810.github.io/formulario-de-matricula/portfolio-demos/?demo=tradutor) |

## Arquitetura da vitrine

- `index.html` — ponto de entrada, com política de conteúdo restritiva (CSP).
- `assets/ruby-showcase.css` — sistema visual demonstrativo inspirado no design system Ruby, com Manrope, temas claro/escuro, painéis e sidebar.
- `assets/ruby-showcase-v5.js` — dados fictícios, navegação, filtros, painéis e interações inteiramente locais.
- `assets/style.css` e `assets/app.js` — primeira versão, preservada apenas como referência histórica.

## Produtos e limites

**Ruby BI:** plataforma de análises com organização visual baseada no Ruby Tower Control. Esta vitrine não representa o backend de produção e não contém lógica de negócio proprietária.

**FleetOps:** produto independente para administração de frota/agregados. Exemplo de cálculo: valor da saída + `max(0, km rodados - km de franquia) × adicional por km` + valor de ajudante (quando aplicável). Não registra negociações nem pagamentos.

**Order Control Center:** apresentação de uma torre operacional de pedidos com fluxos inspirados em processos logísticos. Não acessa dados reais do Ruby.

**Lumus PDV Desktop:** aplicativo Electron independente em [sistema-pedidos/desktop-pdv](https://github.com/Ronilima1810/sistema-pedidos/tree/master/desktop-pdv), com preview estático navegável e instalador Windows gerado via GitHub Actions. Não representa integração SaaS completa nem realiza vendas fiscais.

## Segurança

Todas as demonstrações são **offline-first, estáticas e com dados inventados**. Não há integração com banco de dados, endpoints corporativos, tracking GPS, autenticação real, dados pessoais ou credenciais. Exportações CSV contêm somente informações de demonstração.

## Publicação

O GitHub Pages do repositório `formulario-de-matricula` já fornece a página em `/portfolio-demos/`. Os arquivos de produção do sistema Ruby e dos aplicativos Android não foram modificados.


## Live previews por produto

| Sistema | Interface | Código original |
| --- | --- | --- |
| Ruby Tower | [Dashboard e módulos](./ruby/) | Repositório privado `ruby-tower-control` |
| FleetOps Admin | [Administração de frota](./fleet/) | Repositório privado `fleetops-gestao-frota` |
| Android FleetOps | [Simulador móvel](./android/) | Kotlin e Jetpack Compose no repositório privado |
| Lumus PDV Desktop | [Caixa e estoque](./pdv/) | Electron no repositório `sistema-pedidos` |

As pastas `system/` e `android/` contêm código de interface independente da produção, com lógica de interação simulada. **O preview do Android não é um emulador de APK**, e sim uma reconstrução web visual dos fluxos nativos (login, home, romaneios, rotas, mapa, histórico e perfil).

Todos os previews são estáticos, publicados no GitHub Pages, com políticas de conteúdo que proíbem requisições a APIs externas. Os dashboards públicos **não** publicam os arquivos PHP, o backend, o banco de dados, tokens, fotos ou documentos corporativos.

## Verificações realizadas

Os previews Ruby, FleetOps e Android foram disponibilizados com HTTP 200 e seus scripts JavaScript passaram pela validação sintática. A compilação real do React do repositório `ruby-tower-control`, o APK Android de desenvolvimento e os builds React/Next.js dos projetos públicos possuem workflows próprios.
