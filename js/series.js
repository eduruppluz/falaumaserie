document.addEventListener('DOMContentLoaded', async () => {
  const posts = await FUS.loadPosts();
  const list = FUS.seriesList(posts);
  document.getElementById('count').textContent = `${list.length} séries`;
  document.getElementById('grid').innerHTML = list.map(FUS.seriesCard).join('');
});
