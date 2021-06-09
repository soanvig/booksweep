const { promises: fs } = require('fs');
const { fsInput } = require('../inputs/fsInput');
const { firefoxParser, firefoxApplier } = require('../parsers/firefoxParser');
const { testers } = require('../testers');
const { spawnWorkers } = require('./workerManager');

const assignTesters = ( bookmarks) => {
  return bookmarks.map(bookmark => ({
    ...bookmark,
    tester: testers.find(t => t.pretest(bookmark.url))?.name ?? null,
  }));
}

const masterProcessor = async () => {
  const bookmarksPath = process.argv[2];
  const bookmarksJson = await fsInput(bookmarksPath);
  const bookmarks = firefoxParser(bookmarksJson);
  const bookmarksWithTesters = assignTesters(bookmarks);

  const result = await spawnWorkers(bookmarksWithTesters);

  const applied = firefoxApplier(bookmarksJson, result);

  await fs.writeFile('./parsed.json', JSON.stringify(applied));
}

module.exports = {
  masterProcessor,
};
