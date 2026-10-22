# SimulaFácil — arquitetura e plano de evolução

## Entrega atual: Fase 1

React 19 + TypeScript, Tailwind CSS 4, shadcn/ui (Button), Lucide, Zod e Recharts. Vinext oferece o modelo de rotas do Next.js e renderização HTML no servidor em Cloudflare Workers. A integração Sites e o manifesto `.openai/hosting.json` são preservados. Não há banco de dados, cadastro ou cobrança ativos.

### Páginas

- `/`: landing e dashboard público, exatamente seis ferramentas, demonstração calculada, expansão de ferramentas futuras, conteúdo e CTA.
- `/simulador-financiamento-imobiliario`, `/simulador-amortizacao`, `/simulador-consorcio`, `/simulador-financiamento-veiculo`, `/simulador-quitacao-antecipada`, `/simulador-juros-compostos`.
- `/comparadores`, `/conteudos`, dois artigos, `/planos`, `/conta`, `/metodologia`, `/privacidade`, `/termos`, `/cookies`.
- `/sitemap.xml`, `/robots.txt`, página 404.

As páginas públicas entregam H1, conteúdo e metadados em HTML, sem depender apenas de JavaScript para indexação. Cada simulador possui canonical, title, descrição, Open Graph e JSON-LD de aplicação gratuita e FAQ. Gráficos carregam no cliente; resultados e explicações aparecem no HTML inicial.

### Separação de responsabilidades

| Camada            | Arquivos                   | Responsabilidade                                              |
| ----------------- | -------------------------- | ------------------------------------------------------------- |
| Rotas/SEO         | `app/`                     | HTML do servidor, metadados, sitemap e roteamento             |
| Interface         | `components/`              | Navegação, formulários, resultados, gráficos e tabelas        |
| Configuração      | `lib/simulators.ts`        | Campos, valores ilustrativos editáveis, perguntas e descrição |
| Cálculo           | `lib/finance.ts`           | Funções determinísticas e validação numérica Zod              |
| Testes            | `scripts/test-finance.mjs` | Referências conhecidas, conservação de principal e extremos   |
| Contratos futuros | `docs/openapi.yaml`        | Fronteira HTTP versionada para backend Supabase ou Java 21    |
| Banco futuro      | `docs/schema-proposed.sql` | Modelo PostgreSQL/Supabase com RLS; não aplicado              |

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

## Banco de dados proposto

`profiles` (ligado ao auth.users), `simulations`, `scenarios`, `plans`, `subscriptions`, `payments`, `reports`, `webhook_events`, `content_articles`, `usage_events`. Simulações e relatórios pertencem a um único usuário. A relação composta cenário/simulação/usuário impede vínculos entre contas. Planos e conteúdo publicado podem ser lidos publicamente. Dados comerciais só serão alterados pelo backend autorizado; não por status visual do frontend.

O SQL proposto em `docs/schema-proposed.sql` é preparação e não uma migração executada. Nenhuma métrica administrativa é inventada. A fase de contas deve implementar verificação de e-mail, recuperação de senha, exclusão integral de dados, políticas de retenção e contato do controlador antes de abrir cadastro.

## Próximas fases (não implementadas)

2. Supabase Auth/PostgreSQL, histórico persistido, duplicação e exclusão, comparação salva, PDF profissional e prévia. Recalcular no servidor parâmetros de relatórios; não confiar em totais enviados pelo cliente.
3. Gateway PIX/cartão, checkout, webhook assinado e idempotente, entitlement validado no servidor, assinatura e administração protegida. Preços e limites configuráveis no banco. Servidor deve limitar requisições por usuário/IP e validar autorização antes de gerar ou entregar um relatório pago. Sem segredos no navegador.
4. Conteúdo ampliado, novas ferramentas e IA explicativa opcional, sempre limitada aos resultados calculados. Integrações somente após configuração e testes. AdSense depende de aprovação, política atualizada e gestão adequada de consentimento.

As versões HTTP v1 e `engineVersion` devem estabilizar as respostas para uma possível implementação Java 21/Spring Boot, reutilizando os mesmos casos de referência como testes de contrato. Valores monetários serializados como decimais string, datas ISO no transporte e DD/MM/AAAA na interface.

## Verificação e execução

`npm run test:finance` executa os testes do motor. `npm run typecheck` verifica TypeScript. `npm run dev` inicia em http://127.0.0.1:5173. `npm run build` gera Worker e assets. Os comandos pressupõem Node >=22.13. Uma distribuição portátil está disponível na pasta irmã `.tools` deste ambiente.

No Windows deste ambiente, o chamador de npm do helper Sites resolveu o shim incorretamente. A instalação foi concluída chamando o entrypoint JavaScript oficial do npm com o diretório do Node no PATH. A compilação direta usou o script original `scripts/run-framework.mjs build`. Nenhum pacote do plugin ou configuração global foi alterado.

A versão hospedada permanece privada. Publicação pública e coleta de dados exigirão completar a identificação do controlador e revisar as políticas conforme a operação comercial real.
