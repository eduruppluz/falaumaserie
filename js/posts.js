document.addEventListener('DOMContentLoaded', async () => {
  const posts = await FUS.loadPosts();
  const tipo = FUS.qs('tipo') || '';
  const serie = FUS.qs('serie') || '';
  const T = FUS.TYPES;

  const h1 = document.getElementById('pageH1'), p = document.getElementById('pageP');
  if (T[tipo]) { h1.textContent = T[tipo].plural; p.textContent = T[tipo].desc; document.title = `${T[tipo].plural} — Fala Uma Série`; }
  FUS.navActive(T[tipo] ? tipo : 'posts');

  const types = ['', 'critica', 'ranking', 'recomendacao', 'lista', 'cancelamento', 'episodio'];
  document.getElementById('typeChips').innerHTML = types.map(t => {
    const n = t ? posts.filter(x => x.type === t).length : posts.length;
    const label = t ? T[t].plural : 'Tudo';
    return `<a class="chip ${t === tipo ? 'active' : ''}" href="posts.html${t ? '?tipo=' + t : ''}">${label} <b>${n}</b></a>`;
  }).join('');

  const base = () => posts.filter(x => !tipo || x.type === tipo);
  const select = document.getElementById('fSerie');
  FUS.seriesList(base()).forEach(s => select.insertAdjacentHTML('beforeend', `<option value="${s.slug}">${FUS.esc(s.name)} (${s.count})</option>`));
  select.value = serie;

  const input = document.getElementById('fSearch'), grid = document.getElementById('grid'), count = document.getElementById('count');
  function render() {
    const q = FUS.norm(input.value).trim();
    const list = base().filter(x => (!select.value || x.seriesSlug === select.value) &&
      (!q || FUS.norm(`${x.title} ${x.series} ${x.dek}`).includes(q)));
    count.textContent = `${list.length} texto${list.length === 1 ? '' : 's'}`;
    grid.innerHTML = list.length ? list.map(FUS.postCard).join('') : '<div class="empty">Nada por aqui com esses filtros.</div>';
  }
  input.addEventListener('input', render);
  select.addEventListener('change', render);
  render();
});
