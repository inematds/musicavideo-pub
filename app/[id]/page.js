import Link from 'next/link';
import { notFound } from 'next/navigation';
import { acharProducao, carregarAcervo, mb, slugDoMvd } from '@/lib/acervo';
import Like from '../Like';

export const revalidate = 3600;

export async function generateStaticParams() {
  const acervo = await carregarAcervo();
  return acervo.musicavideo.map((x) => ({ id: slugDoMvd(x) }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const x = acharProducao(await carregarAcervo(), id);
  return { title: x ? `${x.mvd || ''} ${x.titulo}`.trim() : 'produção não encontrada' };
}

// Uma página por produção, com as versões empilhadas: capa, música, clipe. É a
// mesma leitura do painel local — comparar as duas é o que se faz aqui.
export default async function Producao({ params }) {
  const { id } = await params;
  const acervo = await carregarAcervo();
  const x = acharProducao(acervo, id);
  if (!x) notFound();

  const versoes = (x.faixas || []).map((f) => ({ ...f, capa: f.capa || x.capa }));
  const P = x.prompts;

  return (
    <div className="ficha">
      <p className="meta">
        <Link href="/">← o acervo</Link>
      </p>
      <h2>{x.titulo}</h2>
      <p className="meta">
        {[x.mvd, x.genero, x.bpm && `${x.bpm} bpm`, x.tom, x.bytes && mb(x.bytes)]
          .filter(Boolean)
          .join(' · ')}
      </p>

      {versoes.map((f) => (
        <div className="versao" key={f.nome}>
          {f.capa ? <img src={f.capa} alt={`capa da versão ${f.n}`} /> : null}
          <span className="meta">
            {f.n ? `versão ${f.n} · ` : ''}
            {f.nome}
            {f.aprovada ? ' · aprovada ✓' : ''}
          </span>
          <audio controls preload="none" src={f.url} />
          <Like mvd={slugDoMvd(x)} versao={f.n} rotulo={`curtir a versão ${f.n}`} />
          {f.clipe ? <video controls playsInline preload="none" src={f.clipe} /> : null}
        </div>
      ))}

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
    </div>
  );
}
