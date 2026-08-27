'use client';
import { useEffect, useState } from 'react';

// Uma pessoa, um like — garantido só até onde dá num app sem login: o navegador
// lembra o que já curtiu. Não é antifraude, é evitar que o mesmo clique conte
// dez vezes; contador público sem login é sinal, não urna.
export default function Like({ mvd, versao, rotulo }) {
  // A chave carrega a VERSÃO: `MVD-025:2`. É o que transforma o like em medida
  // — o Suno entrega duas faixas por música e a dúvida real é qual das duas
  // vinga. Um contador por produção somaria as duas e não responderia nada.
  const chave = versao ? `${mvd}:${versao}` : mvd;
  const [n, setN] = useState(null);
  const [meu, setMeu] = useState(false);

  useEffect(() => {
    try {
      setMeu(localStorage.getItem(`like:${chave}`) === '1');
    } catch {}
    fetch(`/api/like?mvd=${encodeURIComponent(chave)}`)
      .then((r) => r.json())
      .then((d) => setN(d.n))
      .catch(() => {});
  }, [chave]);

  function clicar() {
    if (meu) return;
    setMeu(true);
    setN((v) => (v || 0) + 1);
    try {
      localStorage.setItem(`like:${chave}`, '1');
    } catch {}
    fetch('/api/like', { method: 'POST', body: JSON.stringify({ mvd: chave }) })
      .then((r) => r.json())
      .then((d) => { if (d.n) setN(d.n); })
      .catch(() => {});
  }

  return (
    <button className="like" onClick={clicar} aria-pressed={meu}
      title={rotulo ? `curtir a ${rotulo}` : 'curtir'}>
      <span aria-hidden="true">{meu ? '♥' : '♡'}</span>
      {rotulo ? <span className="rot">{rotulo}</span> : null}
      {n !== null && n > 0 ? <span className="n">{n}</span> : null}
    </button>
  );
}
