/* ==========================================================================
   Fala Uma Série — utils.js
   Funções compartilhadas: carregamento de dados, header/footer, cards,
   busca, menu mobile. Carregado em todas as páginas antes do script
   específico de cada uma.
   ========================================================================== */

const FUS = (() => {

  const cache = {};

  async function loadData(name) {
    if (cache[name]) return cache[name];
    const res = await fetch(`data/${name}.json`);
    const json = await res.json();
    cache[name] = json;
    return json;
  }

  async function loadAll() {
    const [series, streamings, news, lists, rankings, releases] = await Promise.all([
      loadData('series'), loadData('streamings'), loadData('news'),
      loadData('lists'), loadData('rankings'), loadData('releases')
    ]);
    return { series, streamings, news, lists, rankings, releases };
  }

  function streamingBySlug(streamings, slug) { return streamings.find(s => s.slug === slug); }
  function seriesBySlug(series, slug) { return series.find(s => s.slug === slug); }

  function fmtDate(iso) {
    const d = new Date(iso + 'T12:00:00');
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '');
  }
  function fmtDateShort(iso) {
    const d = new Date(iso + 'T12:00:00');
    const day = d.toLocaleDateString('pt-BR', { day: '2-digit' });
    const mon = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
    return { day, mon };
  }
  function statusClass(status) {
    const s = status.toLowerCase();
    if (s.includes('dispon') && !s.includes('não')) return 'status-disponivel';
    if (s.includes('não')) return 'status-nao';
    if (s.includes('compr')) return 'status-comprar';
    if (s.includes('alug')) return 'status-alugar';
    return 'status-nao';
  }

  /* ---------------- Card builders ---------------- */

  function seriesCard(item, streamings) {
    const badges = item.streamings.slice(0, 2).map(slug => {
      const st = streamingBySlug(streamings, slug);
      if (!st) return '';
      return `<span class="streaming-badge"><span class="dot" style="background:${st.color}"></span>${st.name}</span>`;
    }).join('');
    return `
    <a class="series-card fade-in" href="serie.html?slug=${item.slug}">
      <div class="poster" style="background:${item.gradient}">
        <span class="badge-corner rating-pill">⭐ ${item.rating.toFixed(1)}</span>
        <span class="poster-title">${item.title}</span>
      </div>
      <div class="card-body">
        <div class="card-top"><span class="card-genre">${item.genres.slice(0,2).join(' · ')}</span></div>
        <div class="card-streamings">${badges}</div>
      </div>
    </a>`;
  }

  function streamingCard(item) {
    const initials = item.name.split(' ').map(w => w[0]).slice(0,2).join('');
    return `
    <a class="streaming-card fade-in" href="streaming.html?slug=${item.slug}">
      <div class="streaming-mark" style="background:${item.color}">${initials}</div>
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <div class="streaming-count">${item.seriesCount} série${item.seriesCount === 1 ? '' : 's'} catalogada${item.seriesCount === 1 ? '' : 's'}</div>
      <span class="btn btn-outline btn-sm">Explorar</span>
    </a>`;
  }

  function newsCard(item) {
    return `
    <a class="news-card fade-in" href="noticia.html?slug=${item.slug}">
      <div class="news-image" style="background:${item.gradient}"></div>
      <div class="news-body">
        <span class="news-cat">${item.category}</span>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <span class="news-meta">${fmtDate(item.date)}</span>
      </div>
    </a>`;
  }

  function newsListRow(item) {
    return `
    <a class="news-list-row fade-in" href="noticia.html?slug=${item.slug}">
      <div class="news-image" style="background:${item.gradient}"></div>
      <div class="news-body">
        <span class="news-cat">${item.category}</span>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <span class="news-meta">${fmtDate(item.date)} · ${item.author}</span>
      </div>
    </a>`;
  }

  function denseCard(item) {
    return `
    <a class="dense-card fade-in" href="noticia.html?slug=${item.slug}">
      <div class="dense-img" style="background:${item.gradient}"></div>
      <div class="dense-body">
        <span class="article-tag ${item.tag && item.tag.toLowerCase() === 'confirmado' ? '' : ''}">${item.tag || item.category}</span>
        <h3>${item.title}</h3>
        <span class="dense-meta">${item.category} · ${fmtDate(item.date)}</span>
      </div>
    </a>`;
  }

  function listCard(item) {
    return `
    <a class="list-card fade-in" href="lista.html?slug=${item.slug}">
      <div class="list-image" style="background:${item.gradient}"><span class="list-count">${item.series.length} séries</span></div>
      <div class="list-body"><h3>${item.title}</h3><p>${item.description}</p></div>
    </a>`;
  }

  function rankingCard(item, series) {
    const rows = item.series.slice(0, 5).map((slug, i) => {
      const s = seriesBySlug(series, slug);
      if (!s) return '';
      return `<div class="ranking-row"><span class="ranking-num">${i+1}</span><span class="rank-title">${s.title}</span><span class="rating-pill">⭐ ${s.rating.toFixed(1)}</span></div>`;
    }).join('');
    return `
    <a class="ranking-card fade-in" href="rankings.html?slug=${item.slug}">
      <div class="ranking-head"><span class="ranking-icon">${item.icon}</span><h3>${item.title}</h3></div>
      ${rows}
    </a>`;
  }

  function ratingBar(label, value) {
    if (!value) return '';
    return `
    <div class="rating-bar-row">
      <span class="label">${label}</span>
      <div class="rating-bar-track"><div class="rating-bar-fill" style="width:${value*10}%"></div></div>
      <span class="value">${value.toFixed(1)}</span>
    </div>`;
  }

  /* ---------------- Header / Footer / Overlays ---------------- */

  const NAV_ITEMS = [
    { href: 'index.html', label: 'Início' },
    { href: 'series.html', label: 'Séries' },
    { href: 'listas.html', label: 'Listas' },
    { href: 'rankings.html', label: 'Rankings' },
    { href: 'streamings.html', label: 'Streamings' },
    { href: 'noticias.html', label: 'Notícias' },
    { href: 'opinioes.html', label: 'Opiniões' },
    { href: 'recomendacoes.html', label: 'Recomendações' },
  ];

  function currentPage() { return location.pathname.split('/').pop() || 'index.html'; }

  function injectHeaderFooter() {
    const cur = currentPage();
    const subnavHtml = NAV_ITEMS.map(n => `<a href="${n.href}" class="${cur === n.href ? 'active' : ''}">${n.label}</a>`).join('');
    const mobileItems = [...NAV_ITEMS, { href: 'calendario.html', label: 'Calendário' }];
    const mobileNavHtml = mobileItems.map(n => `<a href="${n.href}" class="${cur === n.href ? 'active' : ''}">${n.label}</a>`).join('');

    const headerHtml = `
    <div class="header-top">
      <div class="container">
        <a href="index.html" class="brand">
          <img src="assets/logo.png" alt="Fala Uma Série">
          <span class="brand-name">FALA UMA <span>SÉRIE</span></span>
        </a>
        <div class="header-searchbar" id="searchToggle">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span class="placeholder-text">Pesquise por séries, listas, notícias e mais</span>
        </div>
        <div class="header-actions">
          <button class="icon-btn" id="searchToggleMobile" aria-label="Buscar" style="display:none;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <a class="icon-btn" href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg>
          </a>
          <button class="icon-btn hamburger" id="menuToggle" aria-label="Menu">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </div>
    </div>
    <div class="header-subbar">
      <div class="container"><nav class="subnav">${subnavHtml}</nav></div>
    </div>

    <div class="mobile-menu" id="mobileMenu">
      <div class="mobile-menu-top">
        <a href="index.html" class="brand"><img src="assets/logo.png" alt="Fala Uma Série"><span class="brand-name">FALA UMA <span>SÉRIE</span></span></a>
        <button class="icon-btn" id="menuClose" aria-label="Fechar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      ${mobileNavHtml}
      <a class="btn btn-primary" href="https://instagram.com" target="_blank" rel="noopener">Seguir no Instagram</a>
    </div>

    <div class="search-overlay" id="searchOverlay">
      <div class="search-box">
        <div class="search-input-wrap">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="globalSearchInput" placeholder="Pesquise por séries, listas, notícias...">
          <button class="search-close" id="searchClose">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="search-results" id="globalSearchResults"></div>
      </div>
    </div>`;

    const footerHtml = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-top">
          <div class="footer-brand">
            <a href="index.html" class="brand"><img src="assets/logo.png" alt="Fala Uma Série"><span class="brand-name">FALA UMA <span>SÉRIE</span></span></a>
            <p>Seu próximo episódio começa aqui. Notícias, opiniões, listas e rankings pra você nunca mais ficar sem saber o que assistir.</p>
          </div>
          <div class="footer-links">
            <div class="footer-col">
              <h5>Navegue</h5>
              <a href="index.html">Início</a>
              <a href="series.html">Séries</a>
              <a href="listas.html">Listas</a>
              <a href="rankings.html">Rankings</a>
            </div>
            <div class="footer-col">
              <h5>Descubra</h5>
              <a href="streamings.html">Streamings</a>
              <a href="noticias.html">Notícias</a>
              <a href="opinioes.html">Opiniões</a>
              <a href="recomendacoes.html">Recomendações</a>
            </div>
            <div class="footer-col">
              <h5>Fala Uma Série</h5>
              <a href="calendario.html">Calendário</a>
              <a href="busca.html">Busca</a>
              <a href="sobre.html">Sobre</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© ${new Date().getFullYear()} Fala Uma Série. Todos os direitos reservados.</p>
          <div class="social-links">
            <a class="icon-btn" href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>`;

    document.getElementById('header-mount').innerHTML = headerHtml;
    document.getElementById('footer-mount').innerHTML = footerHtml;
    bindHeaderEvents();
  }

  function bindHeaderEvents() {
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const mobileMenu = document.getElementById('mobileMenu');
    menuToggle?.addEventListener('click', () => mobileMenu.classList.add('open'));
    menuClose?.addEventListener('click', () => mobileMenu.classList.remove('open'));
    mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

    const searchToggle = document.getElementById('searchToggle');
    const searchToggleMobile = document.getElementById('searchToggleMobile');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('globalSearchInput');
    let debounceTimer;

    function openSearch() { searchOverlay.classList.add('open'); setTimeout(() => searchInput.focus(), 100); }
    searchToggle?.addEventListener('click', openSearch);
    searchToggleMobile?.addEventListener('click', openSearch);
    searchClose?.addEventListener('click', () => searchOverlay.classList.remove('open'));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') searchOverlay.classList.remove('open'); });

    function toggleMobileSearchIcon() {
      if (!searchToggleMobile) return;
      searchToggleMobile.style.display = window.innerWidth <= 980 ? 'flex' : 'none';
    }
    toggleMobileSearchIcon();
    window.addEventListener('resize', toggleMobileSearchIcon);

    searchInput?.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => runGlobalSearch(searchInput.value), 220);
    });
  }

  async function runGlobalSearch(query) {
    const resultsEl = document.getElementById('globalSearchResults');
    if (!resultsEl) return;
    if (!query || query.trim().length < 2) { resultsEl.innerHTML = ''; return; }
    const q = query.trim().toLowerCase();
    const { series, lists, news, rankings } = await loadAll();

    const sHits = series.filter(s => s.title.toLowerCase().includes(q)).slice(0, 5);
    const lHits = lists.filter(l => l.title.toLowerCase().includes(q)).slice(0, 5);
    const nHits = news.filter(n => n.title.toLowerCase().includes(q)).slice(0, 5);
    const rHits = rankings.filter(r => r.title.toLowerCase().includes(q)).slice(0, 5);

    if (!sHits.length && !lHits.length && !nHits.length && !rHits.length) {
      resultsEl.innerHTML = `<div class="search-empty">Nada encontrado pra "${query}". Tenta outro termo.</div>`;
      return;
    }
    let html = '';
    if (sHits.length) html += `<div class="search-group"><h4>Séries</h4>${sHits.map(s => `<a class="search-hit" href="serie.html?slug=${s.slug}"><span class="swatch" style="background:${s.gradient}"></span><div><strong>${s.title}</strong><small>${s.genres.join(' · ')}</small></div></a>`).join('')}</div>`;
    if (lHits.length) html += `<div class="search-group"><h4>Listas</h4>${lHits.map(l => `<a class="search-hit" href="lista.html?slug=${l.slug}"><span class="swatch" style="background:${l.gradient}"></span><div><strong>${l.title}</strong></div></a>`).join('')}</div>`;
    if (nHits.length) html += `<div class="search-group"><h4>Notícias</h4>${nHits.map(n => `<a class="search-hit" href="noticia.html?slug=${n.slug}"><span class="swatch" style="background:${n.gradient}"></span><div><strong>${n.title}</strong></div></a>`).join('')}</div>`;
    if (rHits.length) html += `<div class="search-group"><h4>Rankings</h4>${rHits.map(r => `<a class="search-hit" href="rankings.html?slug=${r.slug}"><span class="swatch" style="background:#333"></span><div><strong>${r.title}</strong></div></a>`).join('')}</div>`;
    resultsEl.innerHTML = html;
  }

  function qs(name) { return new URLSearchParams(location.search).get(name); }

  return {
    loadData, loadAll, streamingBySlug, seriesBySlug, fmtDate, fmtDateShort, statusClass,
    seriesCard, streamingCard, newsCard, newsListRow, denseCard, listCard, rankingCard, ratingBar,
    injectHeaderFooter, runGlobalSearch, qs
  };
})();

document.addEventListener('DOMContentLoaded', () => { FUS.injectHeaderFooter(); });
