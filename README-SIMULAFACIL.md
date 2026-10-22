# SimulaFácil

Fase 1 do portal financeiro brasileiro: seis simuladores funcionais, gráficos interativos, comparação temporária de cenários, tabelas mensais, CSV e páginas públicas renderizadas no servidor.

## Executar

Requer Node.js >=22.13 e npm. Na primeira instalação, use `npm ci`.

```sh
npm run dev
npm run typecheck
npm run test:finance
npm run build
```

O servidor de desenvolvimento usa `http://127.0.0.1:5173`.

No ambiente Windows atual, o Node portátil fica em `../.tools/node-v22.23.4-win-x64`. Para usar sem instalação global:

```powershell
$env:Path = (Resolve-Path '../.tools/node-v22.23.4-win-x64').Path + ';' + $env:Path
node scripts/run-framework.mjs dev
```

## Estrutura e limites

Leia [a arquitetura](docs/ARCHITECTURE.md), [o esquema PostgreSQL proposto](docs/schema-proposed.sql) e [o contrato de API futuro](docs/openapi.yaml). Os dois últimos são documentação preparatória; não há banco nem endpoints comerciais ativos.

O motor financeiro fica em `lib/finance.ts`, separado do React. A configuração dos campos está em `lib/simulators.ts`. Os valores iniciais são exemplos editáveis; todos os resultados são calculados. As análises são determinísticas.

Contas, histórico persistido, PDF profissional, checkout, assinaturas, webhooks, AdSense, painel administrativo e IA externa pertencem às fases seguintes e estão identificados como indisponíveis. Nenhuma cobrança ou métrica fictícia é apresentada como real.

20 grupos de testes cobrem referências financeiras, formatos brasileiros, taxas, juros zero, amortização, consórcio, quitação, investimentos e prazos longos. A QA local com Chrome verificou os seis formulários, comparação, gráficos, CSV, paginação, expansão, navegação mobile, tema e HTML de SEO. Capturas e resultados ficam em `outputs/`, ignorado no Git.

Os resultados não são propostas oficiais de crédito nem recomendações individualizadas. Antes do lançamento público, complete a identificação do controlador e o canal de privacidade com os dados reais da operação.
