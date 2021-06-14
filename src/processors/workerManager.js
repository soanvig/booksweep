const _ = require('lodash');
const { testers } = require('../testers');

const spawnWorkers = async (bookmarksWithTesters) => {
    const chunks = _.chunk(bookmarksWithTesters, 25);

    let i = 0;
    const results = [];

    for (const bookmarks of chunks) {
      const promises = bookmarks.map(bookmark =>
        bookmark.tester
          ? testers[bookmark.tester].test(bookmark.url)
          : false
      );

      const checkResult = (await Promise.all(promises)).filter(result => result === false);

      results.push(
        ...checkResult,
      );
      i += 1;

      console.log(`
DONE: ${i} / ${chunks.length} (${i * 25}/${bookmarksWithTesters.length})
[missing: ${checkResult.length}, total: ${results.length}]
`);
    }

    return results;
}

module.exports = {
  spawnWorkers,
}