# Fala Uma Série

Diário de séries em primeira pessoa: críticas por temporada, rankings, recomendações, listas e cancelamentos.
Site estático em HTML, CSS e JavaScript puro. Os textos ficam em `data/posts.json` e as imagens em `img/posts/`.

## Rodar localmente
Abra a pasta no VS Code e use a extensão **Live Server** a partir do `index.html`
(os dados são carregados via `fetch`, então não funciona abrindo o arquivo direto).

## Estrutura
- `index.html` — início
- `posts.html?tipo=critica|ranking|recomendacao|lista|cancelamento` — listagens com busca e filtro por série
- `post.html?slug=...` — página de cada texto
- `series.html` / `serie.html?slug=...` — séries e tudo que foi escrito sobre cada uma
- `sobre.html` — sobre o projeto
- `data/posts.json` — todos os textos (título, resumo, corpo em HTML, imagens)
- `css/style.css` — cores nas variáveis `:root`
- `assets/` — logo
