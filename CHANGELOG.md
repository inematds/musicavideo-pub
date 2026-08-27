# CHANGELOG — INEMA MUSICAVIDEO V2

## 2.2.0 — 2026-08-27

- **Uma música, um card, uma página.** O Suno entrega duas faixas por pedido e
  cada uma é uma música diferente — mesma letra e mesmo material de vídeo, outra
  interpretação. Elas viviam empilhadas dentro de um card só, o que obrigava a
  escolher antes de ouvir e deixava o clipe atrás de um segundo clique. Agora
  cada faixa tem o seu card, o seu endereço (`/mvd-013-v1`) e a sua página, e
  **o clipe abre primeiro, ocupando a largura**. O texto (pedido, prompts,
  decupagem) se repete nas duas de propósito: cada página tem de se bastar
  sozinha, e no fim de cada uma há o link para a irmã, para quem quiser
  comparar.
- **Selo de clipe no card**, porque a pergunta que o card faz é "tem vídeo
  aqui?". Quem não tem diz por quê, em vez de mostrar um espaço vazio.
- **O `#` do número do bot não vai mais para a URL.** Produção numerada pelo
  `inemaccbot` chega como `MVD#122`; `/mvd#122` seria lido como âncora e o link
  morreria em `/mvd`. Todo id passa por um sanitizador (`MVD#122` → `mvd-122`),
  e o encontro continua aceitando a forma crua.
- **Rota antiga preservada.** `/mvd-013` continua respondendo: manda para a
  versão aprovada (ou para a primeira). Link já compartilhado não quebra.
- **Faixa sem número não rouba a URL da primeira.** Produção antiga com
  `faixa.mp3` ao lado de `faixa-1.mp3` gerava duas páginas no mesmo endereço, e
  o build escolhia uma em silêncio. Agora ela usa o nome do arquivo
  (`/mvd-001-faixa`), com uma rede de segurança contra qualquer id repetido.

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
