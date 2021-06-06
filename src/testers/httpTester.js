const got = require('got');

module.exports = {
  httpTester: {
    name: 'http',
    pretest (url) {
      return /^http/.test(url);
    },
    async test (url) {
      try {
        const res = await got.head(url);
  
        return res.statusCode < 400;
      } catch {
        return false;
      }
    }
  }
} 