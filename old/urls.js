import { URL } from 'url';

const isYoutubeHost = new RegExp(/youtube\.com$/);

export const isYoutubeVideoUrl = (url) => {
  const urlClass = new URL(url);
  return isYoutubeHost.test(urlClass.host) && urlClass.pathname === '/watch';
}

export const getYoutubeVideoId = (url) => new URL(url).searchParams.get('v');