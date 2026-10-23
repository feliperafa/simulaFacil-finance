export const articles: Record<
  string,
  { title: string; intro: string; sections: [string, string][]; link: string }
> = {
  "sac-ou-price": {
    title: "SAC ou Price: o que muda no seu bolso?",
    intro:
      "A mesma taxa e o mesmo prazo podem produzir parcelas e totais diferentes. A diferença está na forma como o principal é amortizado.",
    sections: [
      [
        "O saldo devedor é a base dos juros",
        "Em cada mês, os juros são calculados sobre o saldo ainda devido. Ao amortizar o principal mais cedo, menos saldo fica sujeito aos juros nos meses seguintes.",
      ],
      [
        "No SAC, a amortização é constante",
        "Com taxa fixa e sem correção, o principal é dividido igualmente pelo prazo. Os juros caem conforme o saldo diminui, e as prestações também caem. A primeira prestação tende a ser maior que a da Price nas mesmas condições.",
      ],
      [
        "Na Price, a prestação é constante",
        "Sob taxa fixa e sem encargos variáveis, o valor de principal e juros da prestação se mantém. A parcela inicial amortiza menos principal; a participação da amortização cresce com o tempo.",
      ],
      [
        "Compare além da primeira parcela",
        "Observe o total de juros, custos, seguros, indexadores e comprometimento da renda. Use o simulador para comparar as duas tabelas com o mesmo valor e prazo. A escolha depende também do orçamento e das condições do contrato.",
      ],
    ],
    link: "simulador-financiamento-imobiliario",
  },
  "juros-compostos": {
    title: "Juros compostos: o tempo faz diferença.",
    intro:
      "Quando os rendimentos permanecem aplicados, o saldo que serve de base para os próximos rendimentos aumenta. Esse efeito é a capitalização composta.",
    sections: [
      [
        "Aportes e tempo têm papéis diferentes",
        "O aporte aumenta o valor investido. A taxa determina a variação por período. O prazo permite repetir a capitalização. Comparar esses três fatores ajuda a avaliar hipóteses de planejamento.",
      ],
      [
        "A taxa precisa corresponder ao período",
        "Uma taxa anual efetiva não deve ser simplesmente dividida por 12. O simulador usa equivalência composta para obter a taxa mensal e aplica os aportes ao final de cada mês.",
      ],
      [
        "O valor nominal não é o poder de compra",
        "A inflação pode reduzir o que o patrimônio final permite comprar. Por isso, o resultado também é descontado pela inflação estimada para ser expresso em reais de hoje.",
      ],
      [
        "Hipóteses não são promessas",
        "Taxas futuras, impostos e inflação podem variar. O modelo permite informar uma alíquota única sobre o ganho final, mas não representa as regras completas de produtos específicos. Simule cenários alternativos e leia as premissas.",
      ],
    ],
    link: "simulador-juros-compostos",
  },
};
