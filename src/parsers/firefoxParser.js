const { deepUnwind } = require('@leocode/code-snippets');

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
    const traverse = (bookmarks) => {
      if (bookmarks.length === 0) {
        return [];
      }

      const ommited = bookmarks.filter(b => !ids.includes(b.guid));

      return ommited.map(b => ({
        ...b,
        children: b.children ? traverse(b.children) : b.children
      }))
    }

    return traverse([bookmarksJson])
  }
} 
