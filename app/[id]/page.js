import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  acharMusica,
  acharProducao,
  carregarAcervo,
  mb,
  musicas,
  slugDoMvd,
} from '@/lib/acervo';
import Like from '../Like';

export const revalidate = 3600;

export async function generateStaticParams() {
  const acervo = await carregarAcervo();
  // As duas rotas convivem: uma por MÚSICA (o que os cards abrem) e a antiga
  // por PRODUÇÃO, que continua de pé para não quebrar link já compartilhado.
  return [
    ...musicas(acervo).map((m) => ({ id: m.id })),
    ...acervo.musicavideo.map((x) => ({ id: slugDoMvd(x) })),
  ];
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const acervo = await carregarAcervo();
  const m = acharMusica(acervo, id);
  if (m) return { title: `${m.producao.titulo} · v${m.faixa.n}` };
  const x = acharProducao(acervo, id);
  return { title: x ? `${x.mvd || ''} ${x.titulo}`.trim() : 'não encontrado' };
}

// O texto que as duas versões dividem. Ele se repete de propósito: cada página
// tem de se bastar sozinha, e o pedido/prompts são o que explicam o que se
// está ouvindo. Duplicar texto é barato; obrigar a voltar para entender, não.
function Texto({ x }) {
  const P = x.prompts;
  return (
    <>
      {x.solicitacao ? <p className="meta">“{x.solicitacao}”</p> : null}
      {P ? (
        <details className="prompts">
          <summary>ver os prompts que foram para os provedores</summary>
          <div className="corpo">
            {P.conceito ? (<><h4>conceito da capa</h4><p>{P.conceito}</p></>) : null}
            {P.tagline ? (<><h4>tagline</h4><p>{P.tagline}</p></>) : null}
            {P.estilo ? (<><h4>estilo da música (Suno)</h4><p>{P.estilo}</p></>) : null}
            {P.imagem ? (<><h4>capa</h4><p>{P.imagem}</p></>) : null}
            {P.negativo ? (<><h4>capa · negativo</h4><p>{P.negativo}</p></>) : null}
            {(P.shots || []).length ? (
              <>
                <h4>decupagem · {P.shots.length} planos</h4>
                {P.shots.map((sh, i) => (
                  <div className="shot" key={i}>
                    <span className="meta">
                      {sh.n}. {sh.secao}
                      {sh.camera ? ` · ${sh.camera}` : ''}
                    </span>
                    <p>{sh.prompt}</p>
                    {sh.alt ? <p className="alt">alt: {sh.alt}</p> : null}
                  </div>
                ))}
              </>
            ) : null}
          </div>
        </details>
      ) : null}
      {(x.docs || []).length ? (
        <p>
          {x.docs.map((d) => (
            <a className="pill" key={d} href={d} target="_blank" rel="noopener">
              abrir {d.split('/').pop()} ↗
            </a>
          ))}
        </p>
      ) : null}
    </>
  );
}

function Cabeca({ x, sufixo }) {
  return (
    <>
      <p className="meta">
        <Link href="/">← o acervo</Link>
      </p>
      <h2>
        {x.titulo}
        {sufixo ? <span className="v"> · {sufixo}</span> : null}
      </h2>
      <p className="meta">
        {[x.mvd, x.genero, x.bpm && `${x.bpm} bpm`, x.tom].filter(Boolean).join(' · ')}
      </p>
    </>
  );
}

// UMA MÚSICA POR PÁGINA: o clipe dela em cima, tocando inteiro, e o resto
// embaixo. A outra versão fica a um link de distância, para quem quiser
// comparar — que era o que a página empilhada fazia por todo mundo.
function Musica({ m, irmas }) {
  const { producao: x, faixa: f } = m;
  return (
    <div className="ficha">
      <Cabeca x={x} sufixo={`versão ${f.n}${f.aprovada ? ' · aprovada ✓' : ''}`} />

      {f.clipe ? (
        <video className="palco" controls playsInline preload="metadata" poster={f.capa} src={f.clipe} />
      ) : (
        <div className="semclipe">
          {x.estados?.clipe === 'erro'
            ? 'O clipe desta versão falhou na geração e ainda não foi refeito.'
            : 'O clipe desta versão ainda não ficou pronto.'}
        </div>
      )}

      <div className="versao">
        {f.capa ? <img src={f.capa} alt={`capa da versão ${f.n}`} /> : null}
        <span className="meta">{f.nome}{f.bytes ? ` · ${mb(f.bytes)}` : ''}</span>
        <audio controls preload="none" src={f.url} />
        <Like mvd={slugDoMvd(x)} versao={f.n} rotulo={`curtir a versão ${f.n}`} />
      </div>

      {irmas.length ? (
        <p className="irmas">
          <span className="meta">a mesma letra, outra interpretação: </span>
          {irmas.map((o) => (
            <Link className="pill" key={o.id} href={`/${o.id}`}>
              versão {o.faixa.n} ↗
            </Link>
          ))}
        </p>
      ) : null}

      <Texto x={x} />
    </div>
  );
}

export default async function Pagina({ params }) {
  const { id } = await params;
  const acervo = await carregarAcervo();

  const m = acharMusica(acervo, id);
  if (m) {
    const irmas = musicas(acervo).filter(
      (o) => o.producao.slug === m.producao.slug && o.id !== m.id
    );
    return <Musica m={m} irmas={irmas} />;
  }

  // Rota antiga (`/mvd-013`): manda para a versão aprovada, ou para a primeira.
  const x = acharProducao(acervo, id);
  if (!x) notFound();
  const desta = musicas(acervo).filter((o) => o.producao.slug === x.slug);
  const escolhida = desta.find((o) => o.faixa.aprovada) || desta[0];
  if (escolhida) {
    return <Musica m={escolhida} irmas={desta.filter((o) => o.id !== escolhida.id)} />;
  }
  return (
    <div className="ficha">
      <Cabeca x={x} />
      <div className="semclipe">Esta produção ainda não tem nenhuma faixa publicada.</div>
      <Texto x={x} />
    </div>
  );
}
