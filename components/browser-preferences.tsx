"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";

// Carregado por site-shell.tsx com ssr: false, pois localStorage só existe no navegador.
export function ThemeToggle() {
  const [dark, setDark] = useState(
    () => localStorage.getItem("sf-theme") === "dark",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  return (
    <button
      className="icon-button"
      title="Alternar tema"
      aria-label="Alternar tema claro e escuro"
      onClick={() => {
        const nextDark = !dark;
        setDark(nextDark);
        localStorage.setItem("sf-theme", nextDark ? "dark" : "light");
      }}
    >
      {dark ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}

export function Consent() {
  const [open, setOpen] = useState(() => !localStorage.getItem("sf-consent"));
  useEffect(() => {
    const reset = () => setOpen(true);
    window.addEventListener("sf-consent-reset", reset);
    return () => window.removeEventListener("sf-consent-reset", reset);
  }, []);
  const choose = (preference: string) => {
    localStorage.setItem("sf-consent", preference);
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
