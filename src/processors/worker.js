const { testers } = require('../testers');

const workerProcessor = () => {
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
};

module.exports = {
  workerProcessor,
}
