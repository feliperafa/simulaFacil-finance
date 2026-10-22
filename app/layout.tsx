import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer, Consent } from "@/components/site-shell";

export const metadata: Metadata = {
  metadataBase: new URL("https://simulafacil-felipe.spryhen2048.chatgpt.site"),
  title: {
    default: "SimulaFácil — Simule seu dinheiro. Economize de verdade.",
    template: "%s | SimulaFácil",
  },
  description:
    "Compare financiamentos, amortização, consórcios e investimentos com seis simuladores financeiros gratuitos. Cálculos reais e premissas transparentes.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "SimulaFácil — Clareza para suas decisões",
    description:
      "Simuladores financeiros gratuitos, cálculos reais e premissas transparentes.",
    locale: "pt_BR",
    type: "website",
    images: ["/og.svg"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased">
        <a className="skip-link" href="#main">
          Pular para o conteúdo
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Consent />
      </body>
    </html>
  );
}
