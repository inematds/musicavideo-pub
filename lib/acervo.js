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

// O `#` do número do bot (`MVD#122`) NÃO pode ir para a URL: o navegador lê
// tudo depois dele como âncora, então `/mvd#122` vira um pedido de `/mvd` e o
// link morre. Aqui ele vira `-`, e o encontro continua aceitando a forma crua.
export function idSeguro(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function slugDoMvd(x) {
  return idSeguro(x.mvd || x.slug || '');
}

export function acharProducao(acervo, id) {
  const alvo = idSeguro(id);
  return acervo.musicavideo.find(
    (x) => slugDoMvd(x) === alvo || idSeguro(x.slug) === alvo
  );
}

// UMA MÚSICA, UMA PEÇA. O Suno entrega duas faixas por pedido e cada uma é uma
// música diferente — mesma letra, mesmo material de vídeo, outra interpretação.
// Empilhá-las dentro de um card só obrigava a comparar antes de ouvir; aqui
// cada uma tem o seu card e a sua página, com o clipe dela tocando inteiro.
// O texto (pedido, prompts, decupagem) se repete nas duas de propósito: é o
// preço de cada página se bastar sozinha.
// Faixa numerada vira `-v1`/`-v2`. Faixa SEM número (produção antiga que tem
// `faixa.mp3` ao lado de `faixa-1.mp3`) cairia em `-v1` e roubaria a URL da
// primeira — então ela usa o nome do arquivo, e duas páginas nunca disputam o
// mesmo endereço.
export function idDaMusica(x, f) {
  const base = slugDoMvd(x);
  const n = idSeguro(f.n);
  return n ? `${base}-v${n}` : `${base}-${idSeguro((f.nome || 'faixa').replace(/\.[^.]+$/, ''))}`;
}

export function musicas(acervo) {
  const fora = [];
  const vistos = new Set();
  for (const x of acervo.musicavideo) {
    for (const f of x.faixas || []) {
      let id = idDaMusica(x, f);
      // Rede de segurança: id repetido viraria duas páginas no mesmo endereço,
      // e o build escolheria uma delas em silêncio.
      while (vistos.has(id)) id += '-b';
      vistos.add(id);
      fora.push({ id, producao: x, faixa: { ...f, capa: f.capa || x.capa } });
    }
  }
  return fora;
}

export function acharMusica(acervo, id) {
  const alvo = idSeguro(id);
  return musicas(acervo).find((m) => m.id === alvo);
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
