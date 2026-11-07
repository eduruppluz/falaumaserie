document.addEventListener('DOMContentLoaded', async () => {
  const posts = await FUS.loadPosts();
  const slug = FUS.qs('slug');
  const list = posts.filter(p => p.seriesSlug === slug);
  FUS.navActive('series');
  if (!list.length) {
    document.getElementById('name').textContent = 'Série não encontrada';
    return;
  }
  const name = list[0].series;
  document.title = `${name} — Fala Uma Série`;
  document.getElementById('name').textContent = name;
  document.getElementById('crumb').textContent = name;
  document.getElementById('sub').textContent = `${list.length} texto${list.length === 1 ? '' : 's'} sobre ${name}.`;

  const order = ['critica', 'ranking', 'episodio', 'lista', 'recomendacao', 'cancelamento'];
  document.getElementById('groups').innerHTML = order.map((t, i) => {
    const items = list.filter(p => p.type === t);
    if (!items.length) return '';
    return `<section class="section ${i % 2 ? 'alt' : ''}"><div class="container">
      <div class="section-title"><h2>${FUS.TYPES[t].plural}</h2></div>
      <div class="grid">${items.map(FUS.postCard).join('')}</div>
    </div></section>`;
  }).join('');
});
