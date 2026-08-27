import Link from 'next/link';
import { carregarAcervo, mb, slugDoMvd } from '@/lib/acervo';
import Like from './Like';

export const revalidate = 3600;

// O card é a PRODUÇÃO, não o vídeo: o Suno entrega duas faixas e cada uma vira
// um clipe, mas é uma pasta, um plano, uma letra. Dois cards separados
// duplicariam os números e quebrariam a comparação, que é o que se faz aqui.
function Card({ x }) {
  const par = (x.faixas || [])
    .map((f) => ({ ...f, capa: f.capa || x.capa }))
    .filter((f) => f.capa);
  const id = slugDoMvd(x);
  return (
    <div className="card">
      {par.length > 1 ? (
        <div className="duas">
          {par.map((f) => (
            <div key={f.nome}>
              <span className={`n${f.aprovada ? ' ok' : ''}`}>
                v{f.n}
                {f.aprovada ? ' ✓' : ''}
              </span>
              <img loading="lazy" src={f.capa} alt={`capa da versão ${f.n}`} />
              <audio controls preload="none" src={f.url} />
              <Like mvd={id} versao={f.n} rotulo={`v${f.n}`} />
            </div>
          ))}
        </div>
      ) : (
        <div className="duas">
          <div>
            {x.capa ? <img loading="lazy" src={x.capa} alt="" /> : null}
            {(x.faixas || [])[0] ? (
              <audio controls preload="none" src={x.faixas[0].url} />
            ) : null}
          </div>
        </div>
      )}
      <div className="b">
        <h3>
          <Link href={`/${id}`}>{x.titulo}</Link>
        </h3>
        {x.mvd ? <span className="pill mvd">{x.mvd}</span> : null}
        <div className="meta">
          {[x.genero, x.bpm && `${x.bpm} bpm`, x.tom, x.bytes && mb(x.bytes)]
            .filter(Boolean)
            .join(' · ')}
        </div>
      </div>
    </div>
  );
}

export default async function Home() {
  const acervo = await carregarAcervo();
  if (!acervo.musicavideo.length) {
    return (
      <p className="vazio">
        O acervo ainda não chegou aqui. As produções aparecem depois de aprovadas
        no painel local e publicadas no acervo.
        {acervo.erro ? <><br />({acervo.erro})</> : null}
      </p>
    );
  }
  return (
    <div className="grade">
      {acervo.musicavideo.map((x) => (
        <Card key={x.slug} x={x} />
      ))}
    </div>
  );
}
