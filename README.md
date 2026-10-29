# Fala Uma Série

Portal de notícias, opiniões e séries (proposta em desenvolvimento).

Site estático em HTML, CSS e JavaScript puro. O conteúdo fica em `data/*.json`
(séries, streamings, notícias, listas, rankings e lançamentos).

## Rodar localmente
Abra a pasta no VS Code e use a extensão **Live Server** a partir do `index.html`
(os dados são carregados via `fetch`, então não funciona abrindo o arquivo direto).

## Editar conteúdo
- Séries: `data/series.json`
- Notícias: `data/news.json`
- Listas: `data/lists.json`
- Rankings: `data/rankings.json`
- Streamings: `data/streamings.json`
- Lançamentos: `data/releases.json`
- Cores: variáveis `:root` em `css/style.css`
- Logo: `assets/logo.png` e `assets/logo-small.png`

> Dados atuais são de demonstração e serão substituídos pelo conteúdo real do Instagram.
