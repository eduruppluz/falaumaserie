/* ==========================================================================
   Fala Uma Série — app.js
   Dados (data/posts.json), header/rodapé, cards e busca. Carregado em todas as páginas.
   ========================================================================== */

const FUS = (() => {
  const INSTAGRAM = 'https://www.instagram.com/falaumaserie/';

  const TYPES = {
    critica:      { label: 'Crítica',      plural: 'Críticas',       slug: 'critica',
                    desc: 'Temporada por temporada, o que eu achei de cada uma.' },
    ranking:      { label: 'Ranking',      plural: 'Rankings',       slug: 'ranking',
                    desc: 'Da temporada que eu menos gostei à que eu mais amei.' },
    recomendacao: { label: 'Recomendação', plural: 'Recomendações',  slug: 'recomendacao',
                    desc: 'Séries que eu indico, com os motivos de cada uma.' },
    lista:        { label: 'Lista',        plural: 'Listas',         slug: 'lista',
                    desc: 'Episódios, momentos e motivos para (re)assistir.' },
    cancelamento: { label: 'Cancelamento', plural: 'Cancelamentos',  slug: 'cancelamento',
                    desc: 'Séries que acabaram cedo demais — e as que mereciam mais.' },
    episodio:     { label: 'Episódio para sempre', plural: 'Episódios para sempre', slug: 'episodio',
                    desc: 'Aqueles episódios que ficam com a gente.' }
  };

  const GRADS = [
    'linear-gradient(135deg,#34290f,#171513)',
    'linear-gradient(135deg,#311619,#161111)',
    'linear-gradient(135deg,#1d2733,#111418)',
    'linear-gradient(135deg,#2a2b2f,#161617)',
    'linear-gradient(135deg,#243020,#111411)',
    'linear-gradient(135deg,#2b1f33,#141116)'
  ];

  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const img = p => (window.__IMG && window.__IMG[p]) || p;
  const qs = name => (window.__params ? window.__params.get(name) : new URLSearchParams(location.search).get(name));
  const gradFor = series => { let h = 0; for (const c of series) h = (h * 31 + c.charCodeAt(0)) >>> 0; return GRADS[h % GRADS.length]; };

  let cache;
  async function loadPosts() {
    if (window.__POSTS) return window.__POSTS;
    if (cache) return cache;
    const res = await fetch('data/posts.json');
    cache = await res.json();
    return cache;
  }

  function seriesList(posts) {
    const map = new Map();
    posts.forEach(p => {
      if (!map.has(p.seriesSlug)) map.set(p.seriesSlug, { name: p.series, slug: p.seriesSlug, count: 0, types: new Set(), cover: null });
      const s = map.get(p.seriesSlug); s.count++; s.types.add(p.type);
      if (!s.cover && p.cover) s.cover = p.cover;
    });
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }

  function typeLabel(p) {
    const base = TYPES[p.type].label;
    return p.season ? `${base} · ${p.season}ª temporada` : base;
  }

  /* ---------------- Cards ---------------- */
  function postCard(p) {
    const red = p.type === 'cancelamento';
    const tag = `<span class="pc-tag ${red ? 'red' : ''}">${esc(typeLabel(p))}</span>`;
    const media = p.cover
      ? `<div class="pc-media"><img src="${esc(img(p.cover))}" alt="" loading="lazy">${tag}</div>`
      : `<div class="pc-media pc-type" style="background:${gradFor(p.series)}">${tag}<span class="pc-series">${esc(p.series)}</span></div>`;
    return `
    <a class="pc" data-type="${p.type}" href="post.html?slug=${p.slug}">
      ${media}
      <div class="pc-body">
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.dek)}</p>
        <div class="pc-meta"><span>${esc(p.series)}</span><span>·</span><span>${p.readMin} min</span>${p.spoiler ? '<span>·</span><span class="sp">spoilers</span>' : ''}</div>
      </div>
    </a>`;
  }

  function seriesCard(s) {
    return `
    <a class="sc fade-in" href="serie.html?slug=${s.slug}" style="background:${gradFor(s.name)}">
      <h3>${esc(s.name)}</h3>
      <small>${s.count} texto${s.count === 1 ? '' : 's'}</small>
    </a>`;
  }

  /* ---------------- Header / Footer ---------------- */
  const NAV = [
    { key: 'home',         href: 'index.html',                    label: 'Início' },
    { key: 'critica',      href: 'posts.html?tipo=critica',       label: 'Críticas' },
    { key: 'ranking',      href: 'posts.html?tipo=ranking',       label: 'Rankings' },
    { key: 'recomendacao', href: 'posts.html?tipo=recomendacao',  label: 'Recomendações' },
    { key: 'lista',        href: 'posts.html?tipo=lista',         label: 'Listas' },
    { key: 'cancelamento', href: 'posts.html?tipo=cancelamento',  label: 'Cancelamentos' },
    { key: 'series',       href: 'series.html',                   label: 'Séries' },
    { key: 'sobre',        href: 'sobre.html',                    label: 'Sobre' }
  ];
  const ICON_SEARCH = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
  const ICON_IG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg>';

  function defaultKey() {
    const page = window.__route || (location.pathname.split('/').pop() || 'index.html');
    if (page === 'index.html') return 'home';
    if (page === 'series.html' || page === 'serie.html') return 'series';
    if (page === 'sobre.html') return 'sobre';
    if (page === 'posts.html') return qs('tipo') || 'posts';
    return '';
  }
  function navActive(key) {
    document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === key));
  }

  function injectHeaderFooter() {
    const links = NAV.map(n => `<a href="${n.href}" data-nav="${n.key}">${n.label}</a>`).join('');
    const mlinks = NAV.map(n => `<a class="m-link" href="${n.href}" data-nav="${n.key}">${n.label}</a>`).join('');
    document.getElementById('header-mount').innerHTML = `
      <div class="container">
        <a href="index.html" class="brand"><img src="assets/logo-small.png" alt="Fala Uma Série"><span class="brand-name">FALA UMA <span>SÉRIE</span></span></a>
        <nav class="main-nav">${links}</nav>
        <div class="header-actions">
          <button class="icon-btn" id="searchToggle" aria-label="Buscar">${ICON_SEARCH}</button>
          <a class="icon-btn" href="${INSTAGRAM}" target="_blank" rel="noopener" aria-label="Instagram">${ICON_IG}</a>
          <button class="icon-btn hamburger" id="menuToggle" aria-label="Menu"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
        </div>
      </div>
`;

    document.body.insertAdjacentHTML('beforeend', `
      <div class="mobile-menu" id="mobileMenu">
        <div class="mobile-menu-top">
          <a href="index.html" class="brand"><img src="assets/logo-small.png" alt=""><span class="brand-name">FALA UMA <span>SÉRIE</span></span></a>
          <button class="icon-btn" id="menuClose" aria-label="Fechar"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        ${mlinks}
        <a class="btn btn-primary" href="${INSTAGRAM}" target="_blank" rel="noopener">Seguir no Instagram</a>
      </div>
      <div class="search-overlay" id="searchOverlay">
        <div class="search-box">
          <div class="search-input-wrap">${ICON_SEARCH}<input type="text" id="searchInput" placeholder="Busque por série, título ou assunto..." autocomplete="off"><button class="search-close" id="searchClose" aria-label="Fechar"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
          <div class="search-results" id="searchResults"></div>
        </div>
      </div>`);

    document.getElementById('footer-mount').innerHTML = `
      <footer class="site-footer"><div class="container">
        <div class="footer-top">
          <div class="footer-brand">
            <a href="index.html" class="brand"><img src="assets/logo-small.png" alt=""><span class="brand-name">FALA UMA <span>SÉRIE</span></span></a>
            <p>Seu próximo episódio começa aqui. Críticas, rankings, recomendações e listas sobre as séries que ficaram comigo.</p>
          </div>
          <div class="footer-links">
            <div class="footer-col"><h5>Ler</h5>
              <a href="posts.html?tipo=critica">Críticas</a><a href="posts.html?tipo=ranking">Rankings</a><a href="posts.html?tipo=recomendacao">Recomendações</a></div>
            <div class="footer-col"><h5>Explorar</h5>
              <a href="posts.html?tipo=lista">Listas</a><a href="posts.html?tipo=cancelamento">Cancelamentos</a><a href="series.html">Séries</a></div>
            <div class="footer-col"><h5>Fala Uma Série</h5>
              <a href="sobre.html">Sobre</a><a href="${INSTAGRAM}" target="_blank" rel="noopener">Instagram</a></div>
          </div>
        </div>
        <div class="footer-bottom">© ${new Date().getFullYear()} Fala Uma Série. Todos os direitos reservados.</div>
      </div></footer>`;

    const menu = document.getElementById('mobileMenu');
    document.getElementById('menuToggle').addEventListener('click', () => menu.classList.add('open'));
    document.getElementById('menuClose').addEventListener('click', () => menu.classList.remove('open'));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

    const overlay = document.getElementById('searchOverlay'), input = document.getElementById('searchInput');
    const open = () => { overlay.classList.add('open'); setTimeout(() => input.focus(), 80); };
    document.getElementById('searchToggle').addEventListener('click', open);
    document.getElementById('searchClose').addEventListener('click', () => overlay.classList.remove('open'));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') overlay.classList.remove('open'); });
    let t; input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => runSearch(input.value), 180); });
    overlay.addEventListener('click', e => { if (e.target.closest('a')) overlay.classList.remove('open'); });
    navActive(defaultKey());
  }

  async function runSearch(query) {
    const el = document.getElementById('searchResults');
    const q = norm(query).trim();
    if (q.length < 2) { el.innerHTML = ''; return; }
    const posts = await loadPosts();
    const hits = posts.filter(p => norm(`${p.title} ${p.series} ${p.dek} ${TYPES[p.type].label}`).includes(q)).slice(0, 14);
    el.innerHTML = hits.length ? hits.map(p => `
      <a class="search-hit" href="post.html?slug=${p.slug}">
        <span class="thumb" style="${p.cover ? `background-image:url('${esc(img(p.cover))}')` : `background:${gradFor(p.series)}`}"></span>
        <div><strong>${esc(p.title)}</strong><small>${esc(typeLabel(p))} · ${esc(p.series)}</small></div>
      </a>`).join('') : `<div class="search-empty">Nada encontrado para "${esc(query)}".</div>`;
  }

  return { TYPES, INSTAGRAM, esc, norm, img, qs, gradFor, loadPosts, seriesList, typeLabel, postCard, seriesCard, injectHeaderFooter, navActive };
})();


/* ---------- Efeitos: revelar ao rolar, spotlight, tilt 3D, contadores, parallax ---------- */
(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SEL = '.section-title, .pc, .tile, .chip, .sc, .cta h2, .cta p, .page-hero h1, .article-body > *';
  let io;
  const countUp = el => {
    const n = parseInt(el.textContent, 10); if (!n || still) return;
    const t0 = performance.now();
    const step = t => { const k = Math.min(1, (t - t0) / 900); el.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
    el.textContent = '0'; requestAnimationFrame(step);
  };
  function scan() {
    if (!io) io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; e.target.classList.add('in'); io.unobserve(e.target);
      e.target.querySelectorAll?.('.n').forEach(countUp);
    }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll(SEL).forEach(el => {
      if (el.dataset.fx) return; el.dataset.fx = 1;
      if (still) return;
      el.classList.add('fx');
      const sib = [...el.parentElement.children].indexOf(el);
      el.style.setProperty('--d', Math.min(sib, 6) * 70 + 'ms');
      io.observe(el);
    });
  }
  let tm; new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(scan, 30); }).observe(document.body, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', scan);

  if (still) return;
  document.addEventListener('mousemove', e => {
    const c = e.target.closest?.('.pc, .tile');
    if (c) {
      const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      c.style.setProperty('--mx', x + 'px'); c.style.setProperty('--my', y + 'px');
      c.style.transform = `perspective(700px) rotateX(${((y / r.height) - .5) * -7}deg) rotateY(${((x / r.width) - .5) * 7}deg) translateY(-5px)`;
    }
    const w = document.querySelector('.wall');
    if (w) { w.style.setProperty('--px', ((e.clientX / innerWidth) - .5) * -26 + 'px'); w.style.setProperty('--py', ((e.clientY / innerHeight) - .5) * -18 + 'px'); }
  });
  document.addEventListener('mouseout', e => { const c = e.target.closest?.('.pc, .tile'); if (c && !c.contains(e.relatedTarget)) c.style.transform = ''; });
})();

if (!window.__PREVIEW) document.addEventListener('DOMContentLoaded', () => FUS.injectHeaderFooter());
