'use client';
import { useEffect, useState } from 'react';

// Uma pessoa, um like — garantido só até onde dá num app sem login: o navegador
// lembra o que já curtiu. Não é antifraude, é evitar que o mesmo clique conte
// dez vezes; contador público sem login é sinal, não urna.
export default function Like({ mvd }) {
  const [n, setN] = useState(null);
  const [meu, setMeu] = useState(false);

  useEffect(() => {
    try {
      setMeu(localStorage.getItem(`like:${mvd}`) === '1');
    } catch {}
    fetch(`/api/like?mvd=${encodeURIComponent(mvd)}`)
      .then((r) => r.json())
      .then((d) => setN(d.n))
      .catch(() => {});
  }, [mvd]);

  function clicar() {
    if (meu) return;
    setMeu(true);
    setN((v) => (v || 0) + 1);
    try {
      localStorage.setItem(`like:${mvd}`, '1');
    } catch {}
    fetch('/api/like', { method: 'POST', body: JSON.stringify({ mvd }) })
      .then((r) => r.json())
      .then((d) => { if (d.n) setN(d.n); })
      .catch(() => {});
  }

  return (
    <button className="like" onClick={clicar} aria-pressed={meu} title="curtir">
      <span aria-hidden="true">{meu ? '♥' : '♡'}</span>
      {n !== null && n > 0 ? <span className="n">{n}</span> : null}
    </button>
  );
}
