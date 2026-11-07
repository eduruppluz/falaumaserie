document.addEventListener('DOMContentLoaded', async () => {
  const posts = await FUS.loadPosts();
  const of = t => posts.filter(p => p.type === t);

  // Hero: parede de capas rolando + palavras animadas
  const covers = [...new Set(posts.flatMap(p => p.cover ? [p.cover] : []))];
  const cols = [0, 1, 2].map(c => covers.filter((_, i) => i % 3 === c));
  document.getElementById('heroBg').innerHTML = '<div class="wall">' + cols.map(col => {
    const imgs = col.map(c => `<img src="${FUS.esc(FUS.img(c))}" alt="" loading="lazy">`).join('');
    return `<div class="wall-col">${imgs}${imgs}</div>`;
  }).join('') + '</div>';
  const ht = document.getElementById('heroTitle');
  let wi = 0;
  ht.innerHTML = ht.innerHTML.replace(/(<em>.*?<\/em>)|([^<\s]+)/g, (m, em, w) => em ? `<span class="w" style="--i:${wi++}">${em}</span>` : `<span class="w" style="--i:${wi++}">${w}</span>`);
  // Faixas rolando
  const names = FUS.seriesList(posts).map(s => s.name.toUpperCase());
  const strip = arr => { const h = arr.map(n => `<span>${FUS.esc(n)}</span>`).join(''); return `<div class="ticker-track">${h}${h}</div>`; };
  document.getElementById('ticker1').innerHTML = strip(names.slice(0, Math.ceil(names.length / 2)));
  document.getElementById('ticker2').innerHTML = strip(names.slice(Math.ceil(names.length / 2)));
  const feat = posts.find(p => p.slug === 'episodio-one-tree-hill') || posts[0];
  document.getElementById('heroFeature').innerHTML = `
    <a class="hero-feature" href="post.html?slug=${feat.slug}">
      <span class="tag">Em destaque</span><span class="t">${FUS.esc(feat.title)}</span>
    </a>`;

  // Atalhos por tipo
  const order = ['critica', 'ranking', 'recomendacao', 'lista', 'cancelamento'];
  document.getElementById('tiles').innerHTML = order.map(t => `
    <a class="tile" data-type="${t}" href="posts.html?tipo=${t}">
      <span class="n">${of(t).length}</span>
      <h3>${FUS.TYPES[t].plural}</h3>
      <p>${FUS.TYPES[t].desc}</p>
    </a>`).join('');

  document.getElementById('rowCriticas').innerHTML = of('critica').map(FUS.postCard).join('');
  document.getElementById('gridRankings').innerHTML = of('ranking').slice(0, 3).map(FUS.postCard).join('');
  document.getElementById('gridRecos').innerHTML = of('recomendacao').slice(0, 6).map(FUS.postCard).join('');
  document.getElementById('gridCancel').innerHTML = of('cancelamento').slice(0, 3).map(FUS.postCard).join('');
  document.getElementById('gridListas').innerHTML = of('lista').slice(0, 3).map(FUS.postCard).join('');
  document.getElementById('seriesChips').innerHTML = FUS.seriesList(posts)
    .map(s => `<a class="chip" href="serie.html?slug=${s.slug}">${FUS.esc(s.name)} <b>${s.count}</b></a>`).join('');
});
