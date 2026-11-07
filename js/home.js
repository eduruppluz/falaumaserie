document.addEventListener('DOMContentLoaded', async () => {
  const posts = await FUS.loadPosts();
  const of = t => posts.filter(p => p.type === t);

  // Hero: imagem de uma crítica + destaque
  const bgPost = posts.find(p => p.slug === 'critica-one-tree-hill-temporada-1') || posts.find(p => p.cover);
  const heroImg = bgPost && ((bgPost.images && bgPost.images[bgPost.images.length - 1]) || bgPost.cover);
  if (heroImg) document.getElementById('heroBg').style.backgroundImage = `url('${FUS.img(heroImg)}')`;
  const feat = posts.find(p => p.slug === 'episodio-one-tree-hill') || posts[0];
  document.getElementById('heroFeature').innerHTML = `
    <a class="hero-feature" href="post.html?slug=${feat.slug}">
      <span class="tag">Em destaque</span><span class="t">${FUS.esc(feat.title)}</span>
    </a>`;

  // Atalhos por tipo
  const order = ['critica', 'ranking', 'recomendacao', 'lista', 'cancelamento'];
  document.getElementById('tiles').innerHTML = order.map(t => `
    <a class="tile" href="posts.html?tipo=${t}">
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
