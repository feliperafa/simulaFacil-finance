# SimulaFácil — arquitetura

## Entrega atual: Fase 1

React 19 + TypeScript, CSS próprio com a base do Tailwind CSS 4, Lucide e Recharts. Os campos monetários usam react-number-format. Vinext oferece o modelo de rotas do Next.js e renderização HTML no servidor em Cloudflare Workers. A integração Sites e o manifesto `.openai/hosting.json` são preservados. Não há banco de dados, cadastro ou cobrança ativos.

### Páginas

- `/`: landing e dashboard público, exatamente seis ferramentas, demonstração calculada, expansão de ferramentas futuras, conteúdo e CTA.
- `/simulador-financiamento-imobiliario`, `/simulador-amortizacao`, `/simulador-consorcio`, `/simulador-financiamento-veiculo`, `/simulador-quitacao-antecipada`, `/simulador-juros-compostos`.
- `/comparadores`, `/conteudos`, dois artigos, `/planos`, `/conta`, `/metodologia`, `/privacidade`, `/termos`, `/cookies`.
- `/sitemap.xml`, `/robots.txt`, página 404.

As páginas públicas entregam H1, conteúdo e metadados em HTML, sem depender apenas de JavaScript para indexação. Cada simulador possui canonical, title, descrição, Open Graph e JSON-LD de aplicação gratuita e FAQ. Gráficos carregam no cliente; resultados e explicações aparecem no HTML inicial.

### Separação de responsabilidades

| Camada       | Arquivos                             | Responsabilidade                                                        |
| ------------ | ------------------------------------ | ----------------------------------------------------------------------- |
| Rotas/SEO    | `app/`                               | HTML do servidor, metadados, sitemap e roteamento                       |
| Interface    | `components/`                        | Navegação, formulários, resultados, gráficos e tabelas                  |
| Dados        | `data/`                              | Campos dos simuladores, valores ilustrativos e artigos                  |
| Cálculo      | `lib/finance.ts`                     | Funções determinísticas e validação numérica com JavaScript             |
| Domínio      | `lib/site.ts`                        | Endereço compartilhado pelos metadados, robots e sitemap                |
| Gráficos     | `components/simulation-chart.tsx`    | Visualizações dos resultados no navegador                               |
| Preferências | `components/browser-preferences.tsx` | Tema e consentimento no localStorage                                    |
| Testes       | `tests/`                             | Referências financeiras, conservação de principal e conversão monetária |

Formulários financeiros não são enviados ao servidor. O resultado inicial usa parâmetros de exemplo no SSR; ao editar e calcular, as funções executam no navegador. Comparações são temporárias em memória. Apenas tema e consentimento são armazenados em localStorage. CSV é gerado localmente, sem envio de dados a terceiros.

## Premissas financeiras

- Juros em taxas efetivas, com equivalência composta de ano para mês. Taxa zero é tratada explicitamente.
- SAC sem correção: principal/n constante. Price: prestação calculada pela fórmula de anuidade, com amortização numericamente estável para prazos longos.
- Correção de financiamento somente quando o usuário ativa e informa uma regra fixa mensal hipotética. Nenhuma projeção de TR ou IPCA é inventada.
- Tarifas e custos de financiamento à vista; seguros mensais constantes. TIR mensal dos fluxos fornece custo anual equivalente **estimado**, sem alegar CET contratual.
- Amortização extra no início do mês escolhido; periodicidade única, mensal ou anual; redução de prazo ou recálculo da prestação. Data estimada usa ciclos mensais da data do saldo. Sem indexador ou encargos não fornecidos.
- Consórcio: cenário condicionado a lance aceito no início, com redução do fundo comum e manutenção das taxas sobre a carta. Correção anual a cada aniversário a partir do mês 13; seguro constante. Não estima contemplação nem devolução da reserva.
- Quitação: principal atualizado por equivalência composta dos dias/30, sem parcelas intermediárias. Horizonte limitado a 31 dias para evitar supor pagamentos e saldos futuros. Solicitar saldo atualizado à instituição para datas posteriores.
- Investimentos: aportes no final do mês; alíquota única sobre ganho final; inflação constante. Não reproduz tributação por lote ou produto.
- Precisão integral durante o cálculo, arredondamento BRL na exibição. Pequenas diferenças na soma de parcelas exibidas são possíveis.

Referência Price: [Banco Central — metodologia de prestações fixas](https://www3.bcb.gov.br/CALCIDADAO/publico/exibirMetodologiaFinanciamentoPrestacoesFixas.do?method=exibirMetodologiaFinanciamentoPrestacoesFixas).

## Verificação e execução

`npm test` executa todos os testes pelo runner nativo do Node, sem gerar arquivos de compilação. `npm run test:finance` executa apenas os testes do motor. `npm run typecheck` verifica TypeScript e `npm run lint` verifica o código. `npm run dev` inicia em http://localhost:3000. `npm run build` gera o Worker e os assets; `npm start` serve esse build local na porta 3000. Os comandos pressupõem Node.js >=22.13.

Não há banco de dados ou API comercial ativos. Contas, histórico persistido, PDF, checkout, assinaturas, administração e IA externa ainda não foram implementados. A interface informa a indisponibilidade desses recursos.
