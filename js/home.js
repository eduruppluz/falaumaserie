document.addEventListener('DOMContentLoaded', async () => {
  const { series, streamings, news, lists, rankings } = await FUS.loadAll();

  // ---------------- NEWS HERO GRID (estilo Omelete) ----------------
  const heroMain = news[0];
  const heroSide = news.slice(1, 4);
  document.getElementById('newsHeroGrid').innerHTML = `
    <a class="news-hero-main fade-in" href="noticia.html?slug=${heroMain.slug}" style="background:${heroMain.gradient}">
      <div class="hero-mini-content">
        <span class="article-tag">${heroMain.tag || heroMain.category}</span>
        <h1>${heroMain.title}</h1>
      </div>
    </a>
    <div class="news-hero-side">
      ${heroSide.map(n => `
        <a class="news-hero-side-item fade-in" href="noticia.html?slug=${n.slug}" style="background:${n.gradient}">
          <div class="hero-mini-content">
            <span class="article-tag">${n.tag || n.category}</span>
            <h3>${n.title}</h3>
          </div>
        </a>
      `).join('')}
    </div>
  `;

  // ---------------- GRID DENSO 1 ----------------
  document.getElementById('denseGrid1').innerHTML = news.slice(4, 8).map(n => FUS.denseCard(n)).join('');

  // ---------------- EM ALTA ----------------
  const trending = series.filter(s => s.trending);
  document.getElementById('trendingRow').innerHTML = trending.map(s => FUS.seriesCard(s, streamings)).join('');

  // ---------------- SÉRIE DA SEMANA ----------------
  const weekPick = series.find(s => s.slug === 'the-last-of-us') || series[1];
  document.getElementById('weekPick').innerHTML = `
    <div class="section-title"><h2>🎬 Série da semana</h2></div>
    <div id="weekPickGrid" style="display:grid;grid-template-columns:280px 1fr;gap:36px;align-items:center;">
      <div style="aspect-ratio:2/3;border-radius:16px;background:${weekPick.gradient};display:flex;align-items:flex-end;padding:20px;">
        <span style="font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:28px;text-transform:uppercase;line-height:1;text-shadow:0 2px 10px rgba(0,0,0,0.6)">${weekPick.title}</span>
      </div>
      <div>
        <div class="hero-meta" style="margin-bottom:14px;">
          <span class="rating-pill">⭐ ${weekPick.rating.toFixed(1)}</span>
          ${weekPick.genres.map(g => `<span class="genre-tag">${g}</span>`).join('')}
        </div>
        <p class="hero-desc" style="max-width:640px;">${weekPick.description}</p>
        <a class="btn btn-primary" href="serie.html?slug=${weekPick.slug}">Conferir análise</a>
      </div>
    </div>
  `;
  function applyWeekPickLayout() {
    const wrap = document.getElementById('weekPickGrid');
    if (!wrap) return;
    wrap.style.gridTemplateColumns = window.innerWidth < 720 ? '1fr' : '280px 1fr';
  }
  applyWeekPickLayout();
  window.addEventListener('resize', applyWeekPickLayout);

  // ---------------- RANKINGS ----------------
  document.getElementById('rankingsGrid').innerHTML = rankings.slice(0, 3).map(r => FUS.rankingCard(r, series)).join('');

  // ---------------- LISTAS ----------------
  document.getElementById('listsGrid').innerHTML = lists.slice(0, 3).map(l => FUS.listCard(l)).join('');

  // ---------------- STREAMINGS ----------------
  document.getElementById('streamingsRow').innerHTML = streamings.map(st => `<div style="width:230px;">${FUS.streamingCard(st)}</div>`).join('');

  // ---------------- GRID DENSO 2 (críticas / opiniões) ----------------
  const reviewItems = series.filter(s => s.opinion).slice(0, 4).map(s => ({
    slug: s.slug, gradient: s.gradient, title: s.opinion.length > 70 ? s.title : s.title,
    tag: 'Crítica', category: s.genres[0], date: null
  }));
  document.getElementById('denseGrid2').innerHTML = series.slice(0, 4).map(s => `
    <a class="dense-card fade-in" href="serie.html?slug=${s.slug}#tab-opiniao">
      <div class="dense-img" style="background:${s.gradient}"></div>
      <div class="dense-body">
        <span class="article-tag">Crítica</span>
        <h3>${s.title}: vale a maratona?</h3>
        <span class="dense-meta">⭐ ${s.rating.toFixed(1)} · ${s.genres[0]}</span>
      </div>
    </a>
  `).join('');

  // ---------------- RECOMENDAÇÕES ----------------
  const base = FUS.seriesBySlug(series, 'breaking-bad');
  const recoSeries = base.similar.map(slug => FUS.seriesBySlug(series, slug)).filter(Boolean);
  document.getElementById('recoSection').innerHTML = `
    <div class="section-title"><h2>🍿 O que assistir agora?</h2></div>
    <p class="section-sub">Você gosta de <strong style="color:var(--yellow)">${base.title}</strong>? A gente te ajuda a achar a próxima.</p>
    <div class="row-scroll">${recoSeries.map(s => FUS.seriesCard(s, streamings)).join('')}</div>
  `;
});
