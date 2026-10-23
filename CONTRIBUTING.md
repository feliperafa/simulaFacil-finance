# Manutenção do SimulaFácil

## Começar

Use Node.js >=22.13 e npm. Na raiz do projeto:

```sh
npm ci
npm run dev
```

Abra http://localhost:3000. Para encerrar, pressione Ctrl+C no terminal que iniciou o servidor. Se aparecer “Another vinext dev server is already running”, use a instância existente ou encerre-a antes de iniciar outra.

## Onde alterar

| Alteração                                            | Arquivo                                                       |
| ---------------------------------------------------- | ------------------------------------------------------------- |
| Texto e layout da página inicial                     | `components/home.tsx`                                         |
| Campos, valores iniciais e perguntas dos simuladores | `data/simulators.ts`                                          |
| Fórmulas, validação e resultados financeiros         | `lib/finance.ts`                                              |
| Conversão de um campo entre reais e percentual       | `lib/currency-fields.ts`                                      |
| Formulário, execução da simulação e exportação CSV   | `components/calculator.tsx`                                   |
| Gráficos                                             | `components/simulation-chart.tsx`                             |
| Cabeçalho e rodapé                                   | `components/site-shell.tsx`                                   |
| Tema e consentimento                                 | `components/browser-preferences.tsx`                          |
| Páginas institucionais                               | `app/<rota>/page.tsx`, por exemplo `app/privacidade/page.tsx` |
| Textos dos artigos                                   | `data/articles.ts`                                            |
| Apresentação dos artigos                             | `app/conteudos/[article]/page.tsx`                            |
| Cards dos simuladores                                | `components/simulator-cards.tsx`                              |
| Estilos                                              | `app/globals.css`                                             |
| Domínio publicado                                    | `lib/site.ts`                                                 |
| Metadados gerais                                     | `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`           |

As rotas em `app/` selecionam e apresentam os componentes. As regras financeiras ficam em `lib/finance.ts` e não devem depender de React, do navegador ou de serviços externos. Consulte as premissas em [ARCHITECTURE.md](docs/ARCHITECTURE.md) antes de alterar um cálculo.

## Alterar um campo

Em `data/simulators.ts`, cada simulador contém sua lista `fields`. Use `numberField` para números e taxas, `currencyField` para valores em reais, `selectField` para opções e `dateField` para datas. `termFields("180")` cria os campos de prazo com 180 meses como exemplo; `rateFields("12")` cria os campos de taxa com 12% ao ano como exemplo.

A propriedade `key` liga o formulário ao cálculo. Ao mudar uma chave, revise seu uso em `lib/finance.ts` e os testes. `hint` explica o campo e `when` controla a exibição condicional.

Um campo que alterna entre reais e percentual declara duas propriedades adicionais: `currencyUnit` identifica o seletor de formato e `currencyBase` identifica o valor de referência. Por exemplo, a entrada usa `unidadeEntrada` e `valor`. A conversão fica em `updateFieldValue`, e os testes em `tests/currency-fields.test.mjs` verificam a preservação do valor.

As datas iniciais são exemplos fixos para manter os resultados reproduzíveis. Não representam a data atual.

## Alterar páginas e artigos

Uma página institucional tem seu próprio `app/<rota>/page.tsx`, com título, descrição, metadados e conteúdo no mesmo arquivo. Não há um roteador adicional em componentes. Para criar uma página pública, siga uma página existente e inclua seu caminho em `app/sitemap.ts`.

Os artigos ficam em `data/articles.ts`; a rota compartilhada cuida apenas da apresentação. Ao cadastrar um artigo, o sitemap passa a incluí-lo automaticamente. Atualize os links editoriais da página inicial e da lista de conteúdos quando quiser destacá-lo nesses locais.

## Validar uma alteração

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

Os testes ficam em `tests/*.test.mjs` e usam `node:test` e `node:assert/strict`. O comando `npm test` usa o suporte do Node para executar os módulos TypeScript importados, sem compilação intermediária. Ao alterar uma fórmula ou uma conversão, acrescente um caso com entradas e resultado esperado verificáveis.

`tests/data.test.mjs` também detecta endereços duplicados, seletores inválidos e referências a campos ou simuladores inexistentes. TypeScript avisa sobre variáveis e imports sem uso. Os botões usam HTML e os estilos compartilhados de `app/globals.css`, sem uma biblioteca adicional de componentes.

Para mudanças de interface, confira no navegador: calcular e restaurar valores, alternar reais/percentual, trocar o gráfico, comparar cenários, exportar CSV, alternar o tema e reabrir as preferências de cookies. Confira também a navegação no celular.

Os gráficos e as preferências são carregados com `ssr: false` porque dependem do navegador. Isso permite ler `localStorage` nas preferências sem misturar essa inicialização com o HTML gerado no servidor.

## Ferramentas e hospedagem

`vite.config.ts` configura Vinext e Cloudflare e usa `vinext/server/fetch-handler` diretamente como entrada do servidor. Vite é o compilador usado pelo Vinext para executar as rotas do app. Os comandos `dev`, `build` e `start` chamam as ferramentas diretamente, sem scripts de instalação, wrappers de execução ou perfis específicos de máquina.

O processamento do Tailwind pelo PostCSS também fica em `vite.config.ts`, na opção `css.postcss`. Não há um arquivo `postcss.config` separado.

A função `sites()` no próprio `vite.config.ts` copia o manifesto `.openai/hosting.json` para o build, mantendo os dados usados na publicação pelo Sites. A aplicação não usa banco ou conectores externos. Não é necessário alterar essa infraestrutura para modificar campos, cálculos ou layout.

Use os comandos npm do projeto. Evite scripts avulsos que dependam de um caminho como `C:/Users/...`. Arquivos temporários e saídas de verificações podem ficar em `outputs/`, ignorado pelo Git. Testes necessários à manutenção devem entrar em `tests/`.
