document.addEventListener('DOMContentLoaded', async () => {
  const posts = await FUS.loadPosts();
  const slug = FUS.qs('slug');
  const p = posts.find(x => x.slug === slug);
  if (p) document.querySelector('main').dataset.type = p.type;
  const root = document.getElementById('article');
  if (!p) {
    root.innerHTML = '<div class="empty" style="padding:120px 24px">Texto não encontrado. <a class="see-all" href="index.html">Voltar ao início</a></div>';
    return;
  }

  document.title = `${p.title} — Fala Uma Série`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', p.dek);
  FUS.navActive(p.type);

  const red = p.type === 'cancelamento';
  const T = FUS.TYPES[p.type];

  // Corpo com figuras distribuídas entre os parágrafos
  const box = document.createElement('div');
  box.innerHTML = p.body;
  const paras = [...box.children].filter(el => el.tagName === 'P');
  const imgs = p.images || [];
  imgs.forEach((src, i) => {
    const idx = Math.min(paras.length - 1, Math.max(1, Math.round(paras.length * (i + 1) / (imgs.length + 1))));
    const fig = document.createElement('figure');
    fig.innerHTML = `<img src="${FUS.esc(FUS.img(src))}" alt="" loading="lazy">`;
    paras[idx].after(fig);
  });

  // Navegação entre temporadas (críticas)
  let nav = '';
  if (p.type === 'critica') {
    const sib = posts.filter(x => x.type === 'critica' && x.seriesSlug === p.seriesSlug).sort((a, b) => a.season - b.season);
    const i = sib.findIndex(x => x.id === p.id);
    const prev = sib[i - 1], next = sib[i + 1];
    nav = `<div class="article-nav">
      ${prev ? `<a href="post.html?slug=${prev.slug}"><small>← Anterior</small><strong>${prev.season}ª temporada</strong></a>` : '<span style="flex:1"></span>'}
      ${next ? `<a class="next" href="post.html?slug=${next.slug}"><small>Próxima →</small><strong>${next.season}ª temporada</strong></a>` : '<span style="flex:1"></span>'}
    </div>`;
  }

  root.innerHTML = `
    <header class="article-head">
      <div class="kicker">
        <span class="k-tag ${red ? 'red' : ''}">${FUS.esc(FUS.typeLabel(p))}</span>
        <a class="k-series" href="serie.html?slug=${p.seriesSlug}">${FUS.esc(p.series)}</a>
      </div>
      <h1>${FUS.esc(p.title)}</h1>
      <p class="dek">${FUS.esc(p.dek)}</p>
      <div class="article-meta">${p.readMin} min de leitura${p.spoiler ? ' · contém spoilers' : ''}</div>
    </header>
    ${p.cover ? `<div class="article-cover"><img src="${FUS.esc(FUS.img(p.cover))}" alt=""></div>` : ''}
    <div class="article-body">${box.innerHTML}</div>
    ${nav}`;

  // Relacionados: mesma série; senão, mesmo tipo
  let rel = posts.filter(x => x.seriesSlug === p.seriesSlug && x.id !== p.id);
  let title = `Mais de ${p.series}`;
  if (rel.length < 3) {
    rel = rel.concat(posts.filter(x => x.type === p.type && x.seriesSlug !== p.seriesSlug).slice(0, 3 - rel.length));
    if (!rel.some(x => x.seriesSlug === p.seriesSlug)) title = 'Continue lendo';
  }
  rel = rel.slice(0, 3);
  if (rel.length) {
    document.getElementById('relatedTitle').textContent = title;
    document.getElementById('related').innerHTML = rel.map(FUS.postCard).join('');
    document.getElementById('relatedSection').style.display = '';
  }

  // Barra de progresso de leitura
  const bar = document.createElement('div'); bar.className = 'progress'; document.body.appendChild(bar);
  const onScroll = () => {
    const el = document.querySelector('.article-body'); if (!el) return;
    const r = el.getBoundingClientRect(), total = r.height - window.innerHeight * .5;
    bar.style.width = Math.max(0, Math.min(100, (-r.top + window.innerHeight * .3) / total * 100)) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});
