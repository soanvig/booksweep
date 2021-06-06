export const getVideos = (youtube, ids) => {
  return youtube.videos.list({
    id: ids.join(','),
    part: 'snippet',
    fields: 'items/id,items/snippet/title',
  }).then(res => res.data.items);
}

export const videoExists = (videos) => (id) => {
  return videos.some(v => v.id === id);
}