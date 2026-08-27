import Link from 'next/link';
import { carregarAcervo, mb, musicas, slugDoMvd } from '@/lib/acervo';
import Like from './Like';

export const revalidate = 3600;

// O card é a MÚSICA, não a produção. O Suno entrega duas faixas por pedido e
// cada uma é uma música diferente — mesma letra e mesmo material de vídeo,
// outra interpretação. Empilhar as duas dentro de um card só obrigava a
// escolher antes de ouvir, e escondia o clipe atrás de um segundo clique.
function Card({ m }) {
  const { producao: x, faixa: f } = m;
  return (
    <div className="card">
      <Link className="capa" href={`/${m.id}`}>
        {f.capa ? <img loading="lazy" src={f.capa} alt={`capa de ${x.titulo} · versão ${f.n}`} /> : null}
        <span className={`n${f.aprovada ? ' ok' : ''}`}>
          v{f.n}
          {f.aprovada ? ' ✓' : ''}
        </span>
        {f.clipe ? <span className="temclipe">▶ clipe</span> : null}
      </Link>
      <div className="b">
        <h3>
          <Link href={`/${m.id}`}>{x.titulo}</Link>
        </h3>
        {x.mvd ? <span className="pill mvd">{x.mvd}</span> : null}
        <div className="meta">
          {[x.genero, x.bpm && `${x.bpm} bpm`, x.tom, f.bytes && mb(f.bytes)]
            .filter(Boolean)
            .join(' · ')}
        </div>
        <audio controls preload="none" src={f.url} />
        {/* A chave do like continua sendo `<mvd>:<versão>` — mudar o formato
            zeraria as curtidas que o público já deu. */}
        <Like mvd={slugDoMvd(x)} versao={f.n} rotulo="curtir" />
      </div>
    </div>
  );
}

export default async function Home() {
  const acervo = await carregarAcervo();
  const lista = musicas(acervo);
  if (!lista.length) {
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
      {lista.map((m) => (
        <Card key={m.id} m={m} />
      ))}
    </div>
  );
}
