const { fsInput } = require('./inputs/fsInput');
const { firefoxParser } = require('./parsers/firefoxParser');
const { httpTester } = require('./testers/httpTester');
const { youtubeTester } = require('./testers/youtubeTester');
const { cpus } = require('os');
const cluster = require('cluster');
const _ = require('lodash');

const testers = [
  youtubeTester,
  httpTester,
];

const assignTesters = ( bookmarks) => {
  return bookmarks.map(bookmark => ({
    ...bookmark,
    tester: testers.find(t => t.pretest(bookmark.url))?.name ?? null,
  }));
}

const main = async () => {
  const bookmarksPath = process.argv[2];
  const bookmarksJson = await fsInput(bookmarksPath);
  const bookmarks = firefoxParser(bookmarksJson);
  const bookmarksWithTesters = assignTesters(bookmarks);

  const result = await spawnWorkers(bookmarksWithTesters.slice(0, 6));

  console.log(result);
}

const spawnWorkers = async (bookmarksWithTesters) => {
  return await new Promise(resolve => {
    let finishedWorkers = 0;
    const workers = [];
    const cores = Math.min(cpus().length, 6);
    const results = [];
    
    const chunks = _.chunk(bookmarksWithTesters, Math.ceil(bookmarksWithTesters.length / cores));
  
    for (let i = 0; i < cores; i += 1) {
      workers.push(cluster.fork());
    }

    cluster.on('online', (worker) => {
      console.log(`Worker ${worker.process.pid} is ready, sending task.`);
    
      const index = workers.findIndex(w => w === worker);
      const chunk = chunks[index];

      worker.send({
        task: 'process',
        bookmarks: chunk,
      });

      worker.on('message', (message) => {
        if (message.type === 'finish') {
          console.log(`Worker ${worker.process.pid} finished task, disconnecting.`);

          results.push(...message.result);

          worker.disconnect();

          finishedWorkers += 1;
          if (finishedWorkers === workers.length) {
            resolve(results);
          }
        }
      });

      worker.on('error', console.error);
    });
  });
}

if (cluster.isMaster) {
  main();
} else {
  process.on('message', async (message) => {
    if (message.task === 'process') {
      const bookmarks = message.bookmarks;

      const result = [];

      for (const bookmark of bookmarks) {
        const tester = testers.find(t => t.name === bookmark.tester);

        if (!tester) {
          continue;
        }

        const testResult = await tester.test(bookmark.url);

        if (!testResult) {
          result.push(bookmark);
        }
      }

      process.send({ type: 'finish', result });
    }
  });
}
