import './globals.css';

export const metadata = {
  title: 'INEMA MUSICAVIDEO V2.0.0',
  description: 'Clipes, faixas e capas produzidos pelo musicavideo — o acervo INEMA.',
};

// A versão fica visível no topo de propósito: são dois painéis vivendo lado a
// lado (o local é o V1), e captura de tela sem versão vira adivinhação.
export const VERSAO = '2.0.0';

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="topo">
          <h1>
            INEMA MUSICAVIDEO <span>V{VERSAO}</span>
          </h1>
          <span className="sub">o acervo</span>
          <nav>
            <a href="/">clipes &amp; músicas</a>
            <a href="/analises">análises de vídeo</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
