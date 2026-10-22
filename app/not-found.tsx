import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container info-page">
      <span className="overline">404</span>
      <h1>Esse caminho ainda não existe.</h1>
      <p>Encontre a ferramenta certa para seu próximo passo.</p>
      <Link href="/#simuladores" className="button">
        Explorar simuladores
      </Link>
    </div>
  );
}
