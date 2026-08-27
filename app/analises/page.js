import { carregarAcervo, ytid } from '@/lib/acervo';

export const revalidate = 3600;
export const metadata = { title: 'INEMA MUSICAVIDEO V2 — análises de vídeo' };

// A análise sobe como TEXTO, e só. O `fonte.mp4` — o vídeo de terceiros baixado
// do YouTube — nunca sai da máquina: re-hospedar seria redistribuição de obra
// alheia, e o valor da análise é o que está escrito nela. O vídeo original
// aparece pelo embed oficial, quando há URL de origem.
export default async function Analises() {
  const acervo = await carregarAcervo();
  if (!acervo.analisevideo.length) {
    return <p className="vazio">Nenhuma análise publicada ainda.</p>;
  }
  return (
    <div className="grade">
      {acervo.analisevideo.map((a) => {
        const yid = ytid(a.url);
        return (
          <div className="card" key={a.slug}>
            {yid ? (
              <img
                loading="lazy"
                src={`https://img.youtube.com/vi/${yid}/hqdefault.jpg`}
                alt=""
                style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
              />
            ) : null}
            <div className="b">
              <h3>{a.titulo}</h3>
              <div className="meta">
                {[a.canal, a.tipo, a.ritmo, a.bpm && `${a.bpm} bpm`].filter(Boolean).join(' · ')}
              </div>
              {a.resumo ? <p style={{ fontSize: 13.5 }}>{a.resumo}</p> : null}
              {(a.paleta || []).length ? (
                <div className="pal">
                  {a.paleta.map((c) => (
                    <i key={c} title={c} style={{ background: c }} />
                  ))}
                </div>
              ) : null}
              <div>
                {(a.tags || []).map((t) => (
                  <span className="pill" key={t}>{t}</span>
                ))}
              </div>
              {a.url ? (
                <p className="meta">
                  <a href={a.url} target="_blank" rel="noopener">assistir no YouTube ↗</a>
                </p>
              ) : null}
              {a.doc ? (
                <details className="prompts">
                  <summary>ler a análise</summary>
                  <div className="corpo"><pre>{a.doc}</pre></div>
                </details>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
