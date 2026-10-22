"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronUp,
  House,
  ChartNoAxesCombined,
  Users,
  CarFront,
  Wallet,
  Sprout,
  ShieldCheck,
  LockKeyhole,
  Sparkles,
  Calculator,
  Target,
  Layers,
  BookOpen,
} from "lucide-react";
import { simulators, additional } from "@/lib/simulators";
import { amortize, loan, money } from "@/lib/finance";
export const iconMap = {
  home: House,
  chart: ChartNoAxesCombined,
  users: Users,
  car: CarFront,
  wallet: Wallet,
  sprout: Sprout,
};
export function SimulatorCards() {
  return (
    <div className="sim-grid">
      {simulators.map((sim, i) => {
        const Icon = iconMap[sim.icon as keyof typeof iconMap];
        return (
          <Link
            href={"/" + sim.slug}
            key={sim.kind}
            className={"sim-card " + sim.color}
          >
            <div className="card-top">
              <span className="sim-icon">
                <Icon size={25} />
              </span>
              {i === 1 && (
                <span className="popular">
                  <span /> MAIS POPULAR
                </span>
              )}
              <ArrowUpRight className="card-arrow" size={20} />
            </div>
            <h3>{sim.name}</h3>
            <p>{sim.description}</p>
            <div className="card-benefit">
              <Check size={15} />
              {sim.benefit}
            </div>
            <div className="card-link">
              Simular agora <ArrowRight size={17} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
function HeroExample() {
  const [extra, setExtra] = useState(20000);
  const base = loan(300000, 0.008, 360, "SAC");
  const next = amortize(300000, 0.008, 360, "SAC", extra, 1, "unica", "prazo");
  const saving =
    base.reduce((s, r) => s + r.interest, 0) -
    next.reduce((s, r) => s + r.interest, 0);
  return (
    <div className="hero-visual">
      <div className="demo-card">
        <div className="demo-heading">
          <span className="demo-icon">
            <ChartNoAxesCombined size={20} />
          </span>
          <div>
            <strong>Seu dinheiro pode ir mais longe</strong>
            <span>Uma pequena decisão. Um grande impacto.</span>
          </div>
          <span className="live-dot" />
        </div>
        <div className="demo-main">
          <span>Economia estimada em juros</span>
          <strong>{money(saving)}</strong>
          <span className="saving-pill">
            <Sparkles size={13} /> Com uma amortização de {money(extra)}
          </span>
        </div>
        <div
          className="mini-chart"
          aria-label="Ilustração da redução do saldo: linhas calculadas para SAC"
        >
          <div className="chart-labels">
            <span>300 mil</span>
            <span>150 mil</span>
            <span>0</span>
          </div>
          <svg viewBox="0 0 400 130" role="img">
            <defs>
              <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity=".15" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[5, 65, 125].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="400"
                y2={y}
                stroke="var(--border)"
                strokeDasharray="3 4"
              />
            ))}
            <path
              d={`M0 ${125 - ((300000 - extra) / 300000) * 120} L${(next.length / 360) * 400} 125 L0 125 Z`}
              fill="url(#fade)"
            />
            <path
              d="M0 5 L400 125"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="5 5"
              fill="none"
            />
            <path
              d={`M0 ${125 - ((300000 - extra) / 300000) * 120} L${(next.length / 360) * 400} 125`}
              stroke="#10b981"
              strokeWidth="3"
              fill="none"
            />
          </svg>
        </div>
        <div className="chart-legend">
          <span>
            <i className="gray" />
            Cenário atual
          </span>
          <span>
            <i />
            Com amortização
          </span>
        </div>
        <div className="demo-control">
          <label htmlFor="hero-extra">
            Experimente amortizar <strong>{money(extra)}</strong>
          </label>
          <input
            id="hero-extra"
            aria-label="Valor de amortização do exemplo"
            type="range"
            min="5000"
            max="100000"
            step="5000"
            value={extra}
            onChange={(e) => setExtra(Number(e.target.value))}
          />
          <div>
            <span>R$ 5 mil</span>
            <span>R$ 100 mil</span>
          </div>
        </div>
        <p className="demo-disclaimer">
          Exemplo calculado: saldo de R$ 300 mil, SAC, 360 meses, 0,8% a.m., sem
          encargos.
        </p>
      </div>
      <div className="floating-note">
        <span>
          <ShieldCheck size={21} />
        </span>
        <div>
          <strong>Clareza em cada número</strong>
          <small>Cálculos reais. Premissas transparentes.</small>
        </div>
      </div>
      <span className="visual-decoration d1" />
      <span className="visual-decoration d2" />
    </div>
  );
}
export default function Home() {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span /> MAIS CLAREZA. MELHORES DECISÕES.
            </div>
            <h1>
              Simule seu dinheiro.
              <br />
              <em>
                Economize de
                <br className="desktop-break" /> verdade.
              </em>
            </h1>
            <p>
              Compare financiamentos, descubra quanto pode economizar em juros e
              planeje seu futuro financeiro com simuladores inteligentes.
            </p>
            <Link href="#simuladores" className="button hero-cta">
              Começar minha simulação <ArrowRight size={19} />
            </Link>
            <div className="hero-trust">
              <span>
                <Check size={15} /> Gratuito para começar
              </span>
              <span>
                <LockKeyhole size={14} /> Sem cadastro
              </span>
            </div>
          </div>
          <HeroExample />
        </div>
      </section>
      <div className="trust-strip">
        <div className="container">
          <span>
            <Calculator /> Cálculos financeiros reais
          </span>
          <span>
            <ShieldCheck /> Premissas transparentes
          </span>
          <span>
            <LockKeyhole /> Seus dados ficam no navegador
          </span>
          <span>
            <Target /> Você no controle das decisões
          </span>
        </div>
      </div>
      <section id="simuladores" className="section container">
        <div className="section-heading">
          <div>
            <span className="overline">SEU PRÓXIMO PASSO COMEÇA AQUI</span>
            <h2>O que você quer planejar hoje?</h2>
            <p>
              Escolha um simulador. Entenda os números. Decida com confiança.
            </p>
          </div>
          <span className="section-tag">
            <Layers size={15} /> 6 ferramentas, muitas possibilidades
          </span>
        </div>
        <SimulatorCards />
        <div className="expand-area">
          <button
            className="button secondary"
            aria-expanded={expanded}
            aria-controls="additional-simulators"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Mostrar menos" : "Explorar outras simulações"}{" "}
            {expanded ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
          </button>
          <p>Novas formas de cuidar do seu dinheiro, em breve.</p>
        </div>
        {expanded && (
          <div id="additional-simulators" className="additional-grid">
            {additional.map((x) => (
              <div key={x}>
                <Calculator size={18} />
                <strong>{x}</strong>
                <span>Em planejamento</span>
              </div>
            ))}
          </div>
        )}
        <div className="ad-space">
          <span>ESPAÇO PUBLICITÁRIO</span>
          <small>Reservado para futuras parcerias · anúncios desativados</small>
        </div>
      </section>
      <section className="how-section">
        <div className="container">
          <div className="center-heading">
            <span className="overline">
              COMPLICADO É PAGAR JUROS SEM ENTENDER
            </span>
            <h2>Do “e se?” ao próximo passo.</h2>
            <p>Três etapas para transformar dúvidas em um plano mais claro.</p>
          </div>
          <div className="steps">
            {[
              [
                "01",
                "Conte o seu cenário",
                "Informe os valores, a taxa e o prazo. Você pode ajustar tudo depois.",
              ],
              [
                "02",
                "Veja o que os números dizem",
                "Explore resultados, gráficos e uma análise objetiva das suas escolhas.",
              ],
              [
                "03",
                "Compare e decida com clareza",
                "Teste possibilidades e descubra o impacto de cada decisão.",
              ],
            ].map(([n, t, p]) => (
              <div key={n}>
                <span>{n}</span>
                <h3>{t}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section container learn-section">
        <div>
          <span className="overline">CONHECIMENTO TAMBÉM RENDE</span>
          <h2>Entenda antes de escolher.</h2>
          <p>Conceitos financeiros, sem complicação.</p>
          <Link className="text-link" href="/conteudos">
            Explorar conteúdos <ArrowRight size={17} />
          </Link>
        </div>
        <Link href="/conteudos/sac-ou-price" className="article-card">
          <div className="article-art">
            <span>SAC</span>
            <span className="versus">vs.</span>
            <span>PRICE</span>
            <ChartNoAxesCombined size={95} />
          </div>
          <div>
            <span className="overline">FINANCIAMENTOS · LEITURA EDUCATIVA</span>
            <h3>SAC ou Price: o que muda no seu bolso?</h3>
            <p>Entenda como cada sistema distribui as parcelas e os juros.</p>
            <span className="text-link">
              Ler conteúdo <ArrowUpRight size={17} />
            </span>
          </div>
        </Link>
        <Link href="/conteudos/juros-compostos" className="article-card">
          <div className="article-art green-art">
            <Sprout size={85} />
            <span>Tempo + constância</span>
          </div>
          <div>
            <span className="overline">PLANEJAMENTO · LEITURA EDUCATIVA</span>
            <h3>Juros compostos: o tempo faz diferença.</h3>
            <p>Veja como os aportes e o prazo participam do resultado.</p>
            <span className="text-link">
              Ler conteúdo <ArrowUpRight size={17} />
            </span>
          </div>
        </Link>
      </section>
      <section className="container">
        <div className="bottom-cta">
          <div className="cta-icon">
            <BookOpen size={30} />
          </div>
          <div>
            <span className="overline">UM PLANO COMEÇA COM UMA SIMULAÇÃO</span>
            <h2>Seu futuro merece uma conta bem feita.</h2>
            <p>Explore possibilidades com informação, no seu tempo.</p>
          </div>
          <Link className="button" href="#simuladores">
            Vamos simular <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
