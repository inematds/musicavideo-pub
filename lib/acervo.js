// De onde vem o acervo: o manifest.json que o `musicavideo publica-hf` escreve
// no dataset do Hugging Face. Os arquivos pesados (clipe, faixa, capa) NÃO
// passam por aqui — o manifesto traz as URLs do HF e o navegador busca direto
// lá, que é o que mantém esta app leve e o range request funcionando.

export const REPO = process.env.HF_REPO || 'Inematds/musicavideo-acervo';
export const MANIFEST = `https://huggingface.co/datasets/${REPO}/resolve/main/manifest.json`;

// Uma hora. O acervo muda quando alguém aprova uma produção no painel local e o
// cron sobe — não é tempo real, e buscar o manifesto a cada visita só castigaria
// o HF sem mudar nada na tela.
export const revalidate = 3600;

export async function carregarAcervo() {
  try {
    const r = await fetch(MANIFEST, { next: { revalidate } });
    if (!r.ok) throw new Error(`manifesto: HTTP ${r.status}`);
    const d = await r.json();
    return {
      musicavideo: d.musicavideo || [],
      analisevideo: d.analisevideo || [],
      erro: null,
    };
  } catch (e) {
    // Vitrine sem manifesto é página vazia, não erro 500: o acervo pode estar
    // subindo agora, e uma tela em branco com explicação é melhor do que um
    // stack trace público.
    return { musicavideo: [], analisevideo: [], erro: String(e.message || e) };
  }
}

export function slugDoMvd(x) {
  return (x.mvd || x.slug || '').toLowerCase();
}

export function acharProducao(acervo, id) {
  const alvo = String(id).toLowerCase();
  return acervo.musicavideo.find(
    (x) => slugDoMvd(x) === alvo || (x.slug || '').toLowerCase() === alvo
  );
}

export function mb(bytes) {
  if (!bytes) return '';
  return bytes >= 1073741824
    ? `${(bytes / 1073741824).toFixed(1)} GB`
    : `${Math.round(bytes / 1048576)} MB`;
}

// 24 das 30 análises são do YouTube: o id serve para a miniatura oficial e para
// o embed. Sem re-hospedar nada — o vídeo analisado é de terceiros.
export function ytid(u) {
  const m = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/.exec(u || '');
  return m ? m[1] : '';
}
