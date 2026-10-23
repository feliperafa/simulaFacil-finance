# SimulaFácil

Portal financeiro com seis simuladores, gráficos, comparação temporária de cenários, tabelas mensais, exportação CSV e artigos públicos.

## Executar

Requer Node.js >=22.13 e npm.

```sh
npm ci
npm run dev
```

Acesse http://localhost:3000. Mantenha o terminal aberto e use Ctrl+C para encerrar o servidor antes de iniciar outra instância.

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm start
```

`npm start` serve o build local na porta 3000. Para usar outra porta no desenvolvimento: `npm run dev -- --port 3001`.

## Estrutura

- `app/`: páginas, layout, estilos e metadados. Cada página institucional fica na pasta de sua rota, como `app/privacidade/page.tsx`. A rota `app/[slug]/page.tsx` atende os seis simuladores.
- `components/`: componentes visuais compartilhados, formulário, gráficos e preferências do navegador.
- `data/`: textos dos artigos e configuração dos simuladores, incluindo campos e valores iniciais.
- `lib/`: cálculos financeiros, conversão de campos e domínio do site.
- `public/`: favicon e imagem de compartilhamento.
- `tests/`: testes financeiros, conversão dos campos e consistência dos dados, executados diretamente pelo Node.
- `docs/ARCHITECTURE.md`: arquitetura, premissas e limites atuais.
- `CONTRIBUTING.md`: guia para alterar e validar a aplicação.

Os cálculos e a exportação CSV são locais. Comparações são temporárias em memória; tema e consentimento usam localStorage. Não há banco de dados, cadastro, cobrança, geração de PDF ou integração de IA ativos.

## Execução e publicação

Vinext, Vite e Cloudflare Workers executam o app. O `vite.config.ts` usa diretamente o handler padrão do Vinext, sem um arquivo Worker intermediário. O manifesto `.openai/hosting.json` mantém a compatibilidade com a hospedagem Sites.

Os comandos npm chamam Vinext e Wrangler diretamente, sem scripts intermediários ou seleção de perfis de ambiente. A instalação usa `npm ci`. A integração de publicação fica no próprio `vite.config.ts`: ela copia `.openai/hosting.json` para o build. A aplicação não configura conectores externos.

| Pasta | Função | Versionar? |
| --- | --- | --- |
| `.openai/` | Manifesto que identifica o projeto na publicação Sites; é copiado durante o build. | Sim |
| `.vinext/` | Cache e controle da instância do servidor de desenvolvimento. Gerada pelo Vinext. | Não |
| `.wrangler/` | Configuração gerada e dados de execução local das ferramentas Cloudflare. | Não |
| `dist/`, `.next/`, `outputs/` | Builds, tipos gerados e saídas de verificações. | Não |

A antiga `.sites-runtime/` foi removida: os comandos atuais não dependem dela. As pastas geradas pelas ferramentas podem reaparecer ao executar o app. Os testes permanentes ficam em `tests/`; não use scripts com caminhos específicos de uma máquina.

O domínio publicado é configurado uma única vez em `lib/site.ts`. O layout, o robots e o sitemap usam esse mesmo endereço. O sitemap inclui automaticamente os simuladores e artigos cadastrados em `data/`.
