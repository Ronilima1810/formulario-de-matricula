# Ruby Tower Control — preview fiel da interface hospedada

A tela principal é renderizada pelo **mesmo bundle React, CSS de tema e CSS responsivo implantados em /ruby/workspace/**, extraídos dos arquivos originais autorizados na VPS.

O adaptador mock-api.js substitui a resposta de bootstrap por usuário, unidades e módulos fictícios. Ele impede requisições a APIs da produção. Não são enviados banco de dados, chaves, tokens ou dados operacionais.

**Escopo da fidelidade:** shell, cabeçalho, menu, cards e portal inicial. As telas legadas de negócio que dependem de PHP, WMS, autenticação e banco exibem placeholder transparente, não uma reprodução funcional. O aplicativo Android e a administração FleetOps permanecem em previews separados.

Este código foi publicado para comparação visual. A versão pública é uma demonstração, não o sistema Ruby funcional nem uma reprodução homologada de cada tela.
