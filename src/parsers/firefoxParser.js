const { deepUnwind } = require('@leocode/code-snippets');

module.exports = {
  firefoxParser (bookmarksJson) {
    const unwinded = deepUnwind([bookmarksJson], 'children');
    const withUri = unwinded.filter(u => 'uri' in u);
  
    return withUri.map(entry => ({
      id: entry.guid,
      url: entry.uri,
    }));
  }
} 
