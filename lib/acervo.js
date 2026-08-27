export const REPO = process.env.HF_REPO || 'Inematds/musicavideo-acervo';

// A DIVISÃO: mídia no Hugging Face, texto aqui.
//
// O manifesto é texto — títulos, letras, prompts, decupagem, as análises — e é
// exatamente o que esta página renderiza. Por isso ele mora no repo, viaja no
// build e sai junto com o deploy: a página desenha sem depender de rede
// nenhuma. Buscá-lo do HF deixaria a vitrine refém do HF estar de pé para
// mostrar até o próprio título.
//
// Já os arquivos pesados (clipe, faixa, capa) NUNCA passam por aqui: o
// manifesto traz as URLs do HF e o navegador busca direto lá, que é o que
// mantém esta app leve e o range request do vídeo funcionando.
import manifest from '@/data/manifest.json';

export function carregarAcervo() {
  return {
    musicavideo: manifest.musicavideo || [],
    analisevideo: manifest.analisevideo || [],
    erro: null,
  };
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
