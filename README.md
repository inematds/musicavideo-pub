# musicavideo-pub — INEMA MUSICAVIDEO V2.x.x

A **vitrine** do acervo do [musicavideo](https://github.com/inematds/musicavideo):
os clipes, as faixas e as capas servidos do Hugging Face, o painel na Vercel.

Não confundir com **o painel** — esse é o local (`musicavideo painel`,
`INEMA MUSICAVIDEO V1.x.x`), que continua sendo onde se ouve, se compara, se
manda para a lixeira e onde se **aprova o que sobe para cá**. Este app é só
leitura, com uma exceção: o **like** do público, cujas contagens voltam para o
painel local.

- **Arquivos:** dataset público `inematds/musicavideo-acervo` no Hugging Face.
- **Metadados:** `manifest.json`, gerado pelo `musicavideo publica-hf`.
- **Deploy:** importar ESTE repo na Vercel com *Root Directory* `./`. Depois
  disso, publicar é `git push`.

O plano completo (o que sobe, o que não sobe e por quê) vive no repo do
musicavideo: `docs/PLANO-PAINEL-V2.md`.
