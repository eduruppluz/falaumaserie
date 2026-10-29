document.addEventListener('DOMContentLoaded', async () => {
  const { series, streamings } = await FUS.loadAll();
  const slug = FUS.qs('slug');
  const s = FUS.seriesBySlug(series, slug) || series[0];

  document.title = `${s.title} — Fala Uma Série`;
  document.getElementById('pageTitle').textContent = `${s.title} — Fala Uma Série`;
  document.getElementById('pageDesc').setAttribute('content', s.description);

  document.getElementById('detailHeroBg').style.background = s.gradient;
  document.getElementById('dTitle').textContent = s.title;
  document.getElementById('dInfo').innerHTML = `
    <span class="info-chip">${s.genres.join(', ')}</span>
    <span class="info-chip">${s.year}</span>
    <span class="info-chip">${s.seasons} temporada${s.seasons > 1 ? 's' : ''}</span>
    <span class="info-chip">${s.episodes} episódios</span>
    <span class="info-chip">${s.status}</span>
  `;
  document.getElementById('dMeta').innerHTML = `
    <span class="rating-pill">⭐ ${s.rating.toFixed(1)}/10</span>
    ${s.streamings.map(slug2 => {
      const st = FUS.streamingBySlug(streamings, slug2);
      return st ? `<span class="streaming-badge"><span class="dot" style="background:${st.color}"></span>${st.name}</span>` : '';
    }).join('')}
  `;
  document.getElementById('dSynopsis').textContent = s.description;

  const r = s.reviewRatings;
  document.getElementById('ratingBars').innerHTML = [
    FUS.ratingBar('História', r.historia), FUS.ratingBar('Personagens', r.personagens),
    FUS.ratingBar('Roteiro', r.roteiro), FUS.ratingBar('Atuações', r.atuacoes),
    FUS.ratingBar('Direção', r.direcao), FUS.ratingBar('Final', r.final),
  ].join('');

  document.getElementById('opinionText').textContent = s.opinion;

  document.getElementById('seasonsList').innerHTML = s.seasonsList.map(se => `
    <div class="season-row">
      <div><div class="season-name">Temporada ${se.number}</div><div class="season-meta">${se.episodes} episódios · ${se.year}</div></div>
      <span class="rating-pill">⭐ ${se.rating.toFixed(1)}</span>
    </div>`).join('');

  document.getElementById('whereToWatchList').innerHTML = s.whereToWatch.map(w => {
    const st = FUS.streamingBySlug(streamings, w.streaming);
    return `
    <div class="where-row">
      <span class="streaming-badge"><span class="dot" style="background:${st ? st.color : '#888'}"></span>${st ? st.name : w.streaming}</span>
      <span class="where-status ${FUS.statusClass(w.status)}">${w.status}</span>
    </div>`;
  }).join('') + `<p style="color:var(--white-faint);font-size:12.5px;margin-top:14px;">Disponibilidade meramente ilustrativa, para demonstração da interface.</p>`;

  const similar = s.similar.map(sl => FUS.seriesBySlug(series, sl)).filter(Boolean);
  document.getElementById('similarRow').innerHTML = similar.map(sim => FUS.seriesCard(sim, streamings)).join('') || '<p class="empty-state">Sem recomendações no momento.</p>';

  document.getElementById('heroOndeBtn')?.addEventListener('click', () => activateTab('onde'));

  function activateTab(name) {
    const btn = document.querySelector(`.tab-btn[data-tab="${name}"]`);
    if (!btn) return;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${name}`).classList.add('active');
  }
  document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => activateTab(btn.dataset.tab)));

  if (location.hash.startsWith('#tab-')) activateTab(location.hash.replace('#tab-', ''));
});
