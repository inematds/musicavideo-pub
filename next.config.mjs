/** @type {import('next').NextConfig} */
export default {
  // O manifesto vive no HF e muda quando o `publica-hf` roda. Sem revalidação a
  // vitrine mostraria o acervo do dia do build até o próximo deploy.
  experimental: {},
};
