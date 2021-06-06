import { apiKey } from './config.js';
import { cpus } from 'os';
import Cluster from 'cluster';
import Google from "googleapis";
import { getVideos, videoExists } from './youtube.js';
import { collectBookmarkEntries, findBookmarkEntriesByUrlPart } from './bookmarks.js';
import { isYoutubeVideoUrl, getYoutubeVideoId } from './urls.js';
import _ from 'lodash';
import fs from 'fs';

const workers = [];
let finishedWorkers = 0;

const setupWorkers = async () => {
  const cores = Math.min(cpus().length, 6);

  const bookmarksPath = process.argv[2];
  if (!bookmarksPath || !fs.statSync(bookmarksPath).isFile()) {
    console.error(`File '${bookmarksPath}' doesn't exist`);
    process.exit(1);
  }

  for (let i = 0; i < cores; i += 1) {
    workers.push(Cluster.fork());
  }

  const bookmarks = JSON.parse(await fs.readFileSync(bookmarksPath));
  const bookmarkEntries = collectBookmarkEntries(bookmarks);
  const videoIds = bookmarkEntries
    .map(e => e.url)
    .filter(isYoutubeVideoUrl)
    .map(getYoutubeVideoId);

  const videoIdsChunks = _.chunk(videoIds, Math.ceil(videoIds.length / cores));

  const result = [];
  Cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is ready, sending task.`);
    const index = workers.findIndex(w => w === worker);
    const chunk = videoIdsChunks[index];

    worker.send({
      task: 'findNotExistingVideos',
      videoIds: chunk,
    });

    worker.on('message', (message) => {
      if (message.type === 'finishedFindNotExistingVideos') {
        console.log(`Worker ${worker.process.pid} finished task, disconnecting.`);
        result.push(...message.result);
        worker.disconnect();
        finishedWorkers += 1;

        if (finishedWorkers === workers.length) {
          console.log('');

          findBookmarkEntriesByUrlPart(bookmarkEntries, result)
            .map(e => e.title)
            .forEach(title => console.log(`- ${title}`));

          console.log('');
          console.log(`Missing ${result.length} out of ${bookmarkEntries.length} videos`);
        }
      }
    });
  });
}

const processFindNotExistingVideos = async (youtube, videoIds) => {
  const chunks = _.chunk(videoIds, 16);

  return _.flatten(await Promise.all(chunks.map(async (videoIdsChunk) => {
    const foundVideos = await getVideos(youtube, videoIdsChunk);
    const videoExistsFilter = videoExists(foundVideos);
    return videoIdsChunk.filter(id => !videoExistsFilter(id));
  })));
}

if (Cluster.isMaster) {
  setupWorkers();
} else {
  const youtube = new Google.youtube_v3.Youtube({
    auth: apiKey,
  });

  process.on('message', (message) => {
    if (message.task === 'findNotExistingVideos') {
      processFindNotExistingVideos(youtube, message.videoIds)
        .then((result) => process.send({ type: 'finishedFindNotExistingVideos', result }));
    }
  });
}