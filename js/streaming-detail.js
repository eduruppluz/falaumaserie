document.addEventListener('DOMContentLoaded', async () => {
  const { series, streamings, news, releases, lists } = await FUS.loadAll();
  const slug = FUS.qs('slug');
  const st = FUS.streamingBySlug(streamings, slug) || streamings[0];

  document.title = `${st.name} — Fala Uma Série`;
  document.getElementById('pageTitle').textContent = `${st.name} — Fala Uma Série`;
  document.getElementById('pageDesc').setAttribute('content', st.description);
  document.getElementById('stName').textContent = st.name;
  document.getElementById('stDesc').textContent = `Descubra o que assistir na ${st.name}.`;
  document.getElementById('stHero').style.borderBottom = `3px solid ${st.color}`;

  const stSeries = series.filter(s => s.streamings.includes(st.slug));

  const featured = stSeries.slice(0, 4);
  document.getElementById('stFeatured').innerHTML = featured.length
    ? featured.map(s => FUS.seriesCard(s, streamings)).join('')
    : `<p class="empty-state">Catálogo ainda em construção nesta plataforma.</p>`;

  const best = [...stSeries].sort((a,b) => b.rating - a.rating).slice(0, 5);
  document.getElementById('stBest').innerHTML = best.length ? best.map((s, i) => `
    <div class="full-ranking-row">
      <span class="ranking-num">${i+1}</span>
      <div class="poster-thumb" style="background:${s.gradient}"></div>
      <a class="rank-title" href="serie.html?slug=${s.slug}" style="flex:1">${s.title}</a>
      <span class="rating-pill">⭐ ${s.rating.toFixed(1)}</span>
    </div>
  `).join('') : `<p class="empty-state">Sem séries cadastradas ainda.</p>`;

  document.getElementById('stPopular').innerHTML = stSeries.length
    ? stSeries.map(s => FUS.seriesCard(s, streamings)).join('')
    : `<p class="empty-state" style="grid-column:1/-1">Sem séries cadastradas ainda.</p>`;

  const comingSoon = releases.filter(r => r.streaming === st.slug);
  document.getElementById('stComingSoon').innerHTML = comingSoon.length ? comingSoon.map(r => {
    const d = FUS.fmtDateShort(r.date);
    return `<div class="release-row">
      <div class="release-date"><div class="day">${d.day}</div><div class="mon">${d.mon}</div></div>
      <div class="release-info"><h4>${r.name}</h4><p>${r.detail} · ${r.type}</p></div>
    </div>`;
  }).join('') : `<p class="empty-state">Nada confirmado por enquanto — fica de olho no calendário.</p>`;

  const stNews = news.filter(n => n.category.toLowerCase() === st.name.toLowerCase());
  document.getElementById('stNews').innerHTML = stNews.length
    ? stNews.map(n => FUS.newsCard(n)).join('')
    : `<p class="empty-state" style="grid-column:1/-1">Nenhuma notícia sobre ${st.name} por aqui ainda.</p>`;

  const stLists = lists.filter(l => l.series.some(sl => stSeries.map(s => s.slug).includes(sl)));
  document.getElementById('stLists').innerHTML = stLists.length
    ? stLists.slice(0,3).map(l => FUS.listCard(l)).join('')
    : `<p class="empty-state" style="grid-column:1/-1">Ainda sem listas dedicadas a ${st.name}.</p>`;
});
