document.addEventListener('DOMContentLoaded', async () => {
  const { series, streamings } = await FUS.loadAll();

  const fSearch = document.getElementById('fSearch');
  const fGenre = document.getElementById('fGenre');
  const fStreaming = document.getElementById('fStreaming');
  const fYear = document.getElementById('fYear');
  const fStatus = document.getElementById('fStatus');
  const fSort = document.getElementById('fSort');
  const grid = document.getElementById('seriesGrid');
  const resultsCount = document.getElementById('resultsCount');

  const genres = [...new Set(series.flatMap(s => s.genres))].sort();
  genres.forEach(g => fGenre.insertAdjacentHTML('beforeend', `<option value="${g}">${g}</option>`));
  streamings.forEach(st => fStreaming.insertAdjacentHTML('beforeend', `<option value="${st.slug}">${st.name}</option>`));
  const statuses = [...new Set(series.map(s => s.status))];
  statuses.forEach(s => fStatus.insertAdjacentHTML('beforeend', `<option value="${s}">${s}</option>`));
  const years = [...new Set(series.map(s => s.year.slice(0,4)))].sort((a,b) => b - a);
  years.forEach(y => fYear.insertAdjacentHTML('beforeend', `<option value="${y}">${y}</option>`));

  const preStreaming = FUS.qs('streaming');
  if (preStreaming) fStreaming.value = preStreaming;
  const preGenre = FUS.qs('genre');
  if (preGenre) fGenre.value = preGenre;

  function render() {
    let list = [...series];
    const q = fSearch.value.trim().toLowerCase();
    if (q) list = list.filter(s => s.title.toLowerCase().includes(q));
    if (fGenre.value) list = list.filter(s => s.genres.includes(fGenre.value));
    if (fStreaming.value) list = list.filter(s => s.streamings.includes(fStreaming.value));
    if (fYear.value) list = list.filter(s => s.year.startsWith(fYear.value));
    if (fStatus.value) list = list.filter(s => s.status === fStatus.value);

    if (fSort.value === 'rating') list.sort((a,b) => b.rating - a.rating);
    if (fSort.value === 'title') list.sort((a,b) => a.title.localeCompare(b.title));
    if (fSort.value === 'year') list.sort((a,b) => b.year.localeCompare(a.year));

    resultsCount.textContent = `${list.length} série${list.length === 1 ? '' : 's'} encontrada${list.length === 1 ? '' : 's'}`;
    grid.innerHTML = list.length ? list.map(s => FUS.seriesCard(s, streamings)).join('') : `<div class="empty-state" style="grid-column:1/-1">Nenhuma série encontrada com esses filtros.</div>`;
  }

  [fSearch, fGenre, fStreaming, fYear, fStatus, fSort].forEach(el => {
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });
  render();
});
