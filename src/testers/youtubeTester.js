const { URL } = require('url');
const Google = require('googleapis');

const getYoutubeVideoId = (url) => new URL(url).searchParams.get('v');

const getVideos = (youtube, ids) => {
  return youtube.videos.list({
    id: ids.join(','),
    part: 'snippet',
    fields: 'items/id,items/snippet/title',
  }).then(res => res.data.items);
}

const youtube = new Google.youtube_v3.Youtube({
  auth: process.env.YOUTUBE_API_KEY,
});

module.exports = {
  youtubeTester: {
    name: 'youtube',
    pretest (url) {
      const urlClass = new URL(url);
      return /youtube\.com$/.test(urlClass.host) && urlClass.pathname === '/watch';
    },
    async test (url) {
      const id = getYoutubeVideoId(url);
      const result = await getVideos(youtube, [id]);
      return result.some(v => v.id === id);
    }
  }
} 