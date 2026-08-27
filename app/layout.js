import './globals.css';

export const metadata = {
  title: 'INEMA MUSICAVIDEO V2.1.0',
  description: 'Clipes, faixas e capas produzidos pelo musicavideo — o acervo INEMA.',
};

// A versão fica visível no topo de propósito: são dois painéis vivendo lado a
// lado (o local é o V1), e captura de tela sem versão vira adivinhação.
export const VERSAO = '2.1.0';

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
            {/* As duas casas. Cores da marca de cada uma, não da vitrine: o
                INEMA.CLUB é azul, o PRO é preto com borda branca — é assim que
                quem já conhece reconhece de longe, sem ler. */}
            <a className="marca club" href="https://inema.club" target="_blank" rel="noopener">
              INEMA.CLUB
            </a>
            <a className="marca pro" href="https://inema.pro" target="_blank" rel="noopener">
              INEMA.PRO
            </a>
            {/* O canal onde os clipes viram vídeo publicado. É o destino final
                de tudo que está nesta página — sai daqui e vai para lá. */}
            <a className="marca yt" href="https://www.youtube.com/@amoanimais2k"
               target="_blank" rel="noopener">
              @amoanimais2k
            </a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
