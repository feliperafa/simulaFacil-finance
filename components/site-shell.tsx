"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import {
  ArrowUpRight,
  ChartNoAxesCombined,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
// As preferências leem localStorage e são carregadas somente no navegador.
const ThemeToggle = dynamic(
  () => import("./browser-preferences").then((module) => module.ThemeToggle),
  { ssr: false },
);
export const Consent = dynamic(
  () => import("./browser-preferences").then((module) => module.Consent),
  { ssr: false },
);

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="SimulaFácil — início">
      <span className="logo-icon">
        <ChartNoAxesCombined size={23} />
      </span>
      Simula<span>Fácil</span>
      <span className="beta">BETA</span>
    </Link>
  );
}
export function Header() {
  const [menu, setMenu] = useState(false);
  return (
    <header className="header">
      <div className="container nav">
        <Logo />
        <nav
          aria-label="Navegação principal"
          className={menu ? "nav-links open" : "nav-links"}
        >
          <Link href="/" onClick={() => setMenu(false)}>
            Início
          </Link>
          <Link href="/#simuladores" onClick={() => setMenu(false)}>
            Simuladores
          </Link>
          <Link href="/comparadores" onClick={() => setMenu(false)}>
            Comparadores
          </Link>
          <Link href="/conteudos" onClick={() => setMenu(false)}>
            Conteúdos
          </Link>
          <Link href="/planos" onClick={() => setMenu(false)}>
            Planos
          </Link>
        </nav>
        <div className="nav-actions">
          <ThemeToggle />
          <Link href="/conta" className="login-link">
            Entrar <ArrowUpRight size={16} />
          </Link>
          <button
            className="icon-button mobile-menu"
            aria-label={menu ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-top">
          <div>
            <Logo />
            <p>
              Mais clareza nas contas.
              <br />
              Mais confiança nas suas escolhas.
            </p>
          </div>
          <div>
            <strong>Explore</strong>
            <Link href="/#simuladores">Simuladores</Link>
            <Link href="/comparadores">Compare cenários</Link>
            <Link href="/conteudos">Educação financeira</Link>
          </div>
          <div>
            <strong>SimulaFácil</strong>
            <Link href="/metodologia">Nossa metodologia</Link>
            <Link href="/privacidade">Privacidade</Link>
            <Link href="/termos">Termos de uso</Link>
            <button
              className="text-button"
              onClick={() => {
                localStorage.removeItem("sf-consent");
                window.dispatchEvent(new Event("sf-consent-reset"));
              }}
            >
              Preferências de cookies
            </button>
          </div>
          <div className="footer-note">
            <ShieldCheck size={24} />
            <strong>Informação para decidir melhor</strong>
            <p>
              Simulações educativas e estimativas. Não constituem proposta de
              crédito ou recomendação individualizada de investimento.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} SimulaFácil. Todos os direitos
            reservados.
          </span>
          <span>Feito para simplificar suas decisões.</span>
        </div>
      </div>
    </footer>
  );
}
