// O like é a ÚNICA escrita do público, e a única razão de esta app não ser um
// HTML estático puro. Ele existe porque hoje não há sinal nenhum: o acervo é
// produzido no escuro, sem saber qual produção agradou.
//
// Guardado num Redis REST (Vercel KV / Upstash), que é chave-valor e HTTP — não
// precisa de driver, conexão persistente nem migração, e um `INCR` é atômico,
// que é exatamente a operação que um contador de like é.
//
// Sem as variáveis de ambiente a app CONTINUA de pé: o like vira leitura zerada
// e o clique falha silencioso. Vitrine sem contador é vitrine; vitrine que não
// abre não é nada.

const URL_BASE = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';

export const ativo = Boolean(URL_BASE && TOKEN);

const chave = (mvd) => `like:${String(mvd).toLowerCase()}`;

async function comando(partes) {
  if (!ativo) return null;
  const r = await fetch(`${URL_BASE}/${partes.map(encodeURIComponent).join('/')}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    cache: 'no-store',
  });
  if (!r.ok) throw new Error(`kv: HTTP ${r.status}`);
  const d = await r.json();
  return d.result;
}

export async function contar(mvd) {
  try {
    return Number((await comando(['get', chave(mvd)])) || 0);
  } catch {
    return 0;
  }
}

export async function curtir(mvd) {
  try {
    const n = await comando(['incr', chave(mvd)]);
    return n === null ? null : Number(n);
  } catch {
    return null;
  }
}

export async function todos(mvds) {
  // Uma chamada por produção é aceitável: a grade tem dezenas, não milhares, e
  // a página é revalidada de hora em hora — não é um por visita.
  const pares = await Promise.all(mvds.map(async (m) => [m, await contar(m)]));
  return Object.fromEntries(pares);
}
