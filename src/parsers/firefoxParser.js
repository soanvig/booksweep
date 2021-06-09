const { deepUnwind } = require('@leocode/code-snippets');
const { partition } = require('lodash');

module.exports = {
  firefoxParser (bookmarksJson) {
    const unwinded = deepUnwind([bookmarksJson], 'children');
    const withUri = unwinded.filter(u => 'uri' in u);
  
    return withUri.map(entry => ({
      id: entry.guid,
      url: entry.uri,
    }));
  },
  firefoxApplier (bookmarksJson, ids) {
    const omitted = [];

    const traverse = (bookmarks) => {
      if (bookmarks.length === 0) {
        return [];
      }

      const [omit, keep] = partition(bookmarks, b => ids.includes(b.guid));

      omitted.push(...omit);

      return keep.map(b => ({
        ...b,
        children: b.children ? traverse(b.children) : b.children
      }))
    }

    const keep = traverse([bookmarksJson]);
    const omittedDirectory = {
      "guid": "clearedUp________",
      "title": "cleared-up",
      "index": keep[0].children.length,
      "dateAdded": Date.now() * 1000,
      "lastModified": Date.now() * 1000,
      "id": 666,
      "typeCode": 2,
      "type": "text/x-moz-place-container",
      "root": "bookmarksMenuFolder",
      children: omitted,
    }

    return {
      ...keep[0],
      children: [
        ...keep[0].children,
        omittedDirectory,
      ],
    };
  }
} 
