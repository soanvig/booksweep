const { cpus } = require('os');
const cluster = require('cluster');
const _ = require('lodash');

const createWorker = async (task) => {
  return await new Promise((resolve, reject) => {
    const originalWorker = cluster.fork();

    cluster.on('online', worker => {
      if (worker.id !== originalWorker.id) {
        return;
      }
  
      console.log(`Worker ${worker.process.pid} is ready`);

      worker.on('message', (message) => {
        if (message.type === 'finish') {
          console.log(`Worker ${worker.process.pid} finished`);

          worker.disconnect();

          resolve(message.result);
        }
      });

      worker.on('error', (error) => {
        reject(error);
      });

      task(worker);
    })
  })
}

const spawnWorkers = async (bookmarksWithTesters) => {
  return await new Promise(async resolve => {
    const cores = Math.min(cpus().length, 6);
    
    const chunks = _.chunk(bookmarksWithTesters, Math.ceil(bookmarksWithTesters.length / cores));
  
    const results = await Promise.all(chunks.map(chunk => {
      return createWorker(worker => {
        worker.send({
          task: 'process',
          bookmarks: chunk,
        });
      })
    }));

    resolve(results.flat());
  });
}

module.exports = {
  spawnWorkers,
}