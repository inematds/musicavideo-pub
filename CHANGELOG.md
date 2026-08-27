# CHANGELOG — INEMA MUSICAVIDEO V2

## 2.1.0 — 2026-08-27

- **Like por FAIXA**, não por produção: a chave carrega a versão (`MVD-025:2`) e
  cada capa tem o seu botão. É o que transforma o like em medida — o Suno
  entrega duas faixas por música e a dúvida real é qual das duas vinga.
- **O texto vem no repo.** O manifesto (títulos, letras, prompts, decupagem e as
  análises) vive em `data/manifest.json` e viaja no build: a página desenha sem
  depender de rede. No Hugging Face fica só mídia.
- **Topo com as três casas**: INEMA.CLUB (azul), INEMA.PRO (preto e branco) e o
  canal @amoanimais2k (vermelho), cada um na cor da sua marca.

## 2.0.0 — 2026-08-27

- A vitrine nasce: grade com as duas capas e os dois players, ficha por
  `MVD-000` com as versões empilhadas e os prompts, aba de análises em texto.
- `vercel.json` declara o framework no repo, não na tela.
- Next 16 (o 15.5.4 tinha RCE no protocolo React flight).
