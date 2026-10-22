"use client";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ChartNoAxesCombined,
  Menu,
  X,
  Moon,
  Sun,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
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
  const [dark, setDark] = useState(false),
    [menu, setMenu] = useState(false);
  useEffect(() => {
    const d = localStorage.getItem("sf-theme") === "dark";
    setDark(d);
    document.documentElement.dataset.theme = d ? "dark" : "light";
  }, []);
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
          <button
            className="icon-button"
            title="Alternar tema"
            aria-label="Alternar tema claro e escuro"
            onClick={() => {
              setDark(!dark);
              document.documentElement.dataset.theme = !dark ? "dark" : "light";
              localStorage.setItem("sf-theme", !dark ? "dark" : "light");
            }}
          >
            {dark ? <Sun size={19} /> : <Moon size={19} />}
          </button>
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
export function Consent() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(!localStorage.getItem("sf-consent"));
    const reset = () => setOpen(true);
    window.addEventListener("sf-consent-reset", reset);
    return () => window.removeEventListener("sf-consent-reset", reset);
  }, []);
  const choose = (v: string) => {
    localStorage.setItem("sf-consent", v);
    setOpen(false);
  };
  return open ? (
    <aside className="cookie-banner" aria-label="Preferências de privacidade">
      <div>
        <strong>Sua privacidade, suas escolhas.</strong>
        <p>
          Usamos armazenamento local para tema e preferências. Anúncios e
          rastreamento estão desativados nesta versão.{" "}
          <Link href="/cookies">Saiba mais</Link>
        </p>
      </div>
      <button className="button secondary" onClick={() => choose("essential")}>
        Apenas essenciais
      </button>
      <button className="button small" onClick={() => choose("preferences")}>
        Aceitar preferências
      </button>
    </aside>
  ) : null;
}
