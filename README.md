# musicavideo-pub — INEMA MUSICAVIDEO V2.x.x

A **vitrine** do acervo do [musicavideo](https://github.com/inematds/musicavideo):
os clipes, as faixas e as capas servidos do Hugging Face, o painel na Vercel.

Não confundir com **o painel** — esse é o local (`musicavideo painel`,
`INEMA MUSICAVIDEO V1.x.x`), onde se ouve, se compara, se manda para a lixeira e
onde se **aprova o que sobe para cá**. Aqui é só leitura, com uma exceção: o
**like** do público.

## Como funciona

```
painel local  --aprova-->  publica-hf  -->  dataset no Hugging Face
                                                 |  manifest.json
                                                 v
                                          esta app (Vercel)
                                                 |  like
                                                 v
                                   musicavideo likes  -->  painel local
```

- **Arquivos:** dataset público `Inematds/musicavideo-acervo`. Os `<video>` e
  `<audio>` buscam direto lá — o `resolve/main` do HF serve range request
  (verificado: HTTP 206 com `Content-Range` num mp4 de 101 MB), então a barra do
  vídeo navega sem proxy nenhum. Esta app nunca serve mídia.
- **Metadados:** `manifest.json`, escrito pelo `musicavideo publica-hf` a partir
  do MESMO coletor que o painel local usa. Revalidado de hora em hora.
- **Identidade:** cada produção é um `MVD-000`, e é a URL da página (`/mvd-014`).

## O que NÃO está aqui

- **`fonte.mp4` das análises.** É vídeo de terceiros baixado do YouTube:
  re-hospedar seria redistribuição. A aba de análises mostra o TEXTO da análise
  e o vídeo original pelo embed oficial.
- **`raw/`, pastas de teste, `clipe.mp4` duplicado.** Ficam na máquina.
- **Lixeira e aprovação.** São gestos de trabalho — vivem no painel local.

## O like

A única escrita do público, e a razão de a app não ser HTML estático puro.
Guardado num Redis REST (Vercel KV / Upstash), onde `INCR` é atômico. Variáveis:

| variável | para quê |
|---|---|
| `KV_REST_API_URL` / `UPSTASH_REDIS_REST_URL` | endpoint do KV |
| `KV_REST_API_TOKEN` / `UPSTASH_REDIS_REST_TOKEN` | token |
| `HF_REPO` | dataset, se não for o padrão |

**Sem essas variáveis a app continua de pé** — o contador some e o clique não
persiste. Vitrine sem contador é vitrine; vitrine que não abre não é nada. É
assim que ela está hoje: o like ficou para depois, de propósito.

O caminho curto para ligar: no projeto da Vercel, **Storage → Create Database →
Upstash Redis**, conectar ao projeto e reimplantar. A Vercel injeta as duas
variáveis sozinha — não se digita nada. Criando direto na Upstash, os valores
estão na aba **REST API** do banco (o token tem que ser o de escrita; o
read-only não serve, porque o like escreve).

As contagens voltam para o painel local com `musicavideo likes`
(`MUSICAVIDEO_PUB_URL` apontando para cá), e viram um ♥ em cada card. Sem esse
retorno, o único sinal de público que o projeto tem morreria aqui.

## Deploy

Importar **este repo** na Vercel com *Root Directory* `./` (o default). Depois
disso, publicar é `git push` — o webhook faz o resto.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```
