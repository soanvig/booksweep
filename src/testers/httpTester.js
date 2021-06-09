const got = require('got');

/** @TODO ??? this seems to be required but dunno, maybe there is better solution */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

module.exports = {
  httpTester: {
    name: 'http',
    pretest (url) {
      return /^http/.test(url);
    },
    async test (url) {
      try {
        const res = await got.head(url, { throwHttpErrors: false });
        
        return res.statusCode !== 404;
      } catch (e) {
        return false;
        // switch (e.code) {
        //   case 'ENOTFOUND': return false;
        //   case 'ECONNREFUSED': return true; /** @NOTE: unsure */
        //   case 'EAI_AGAIN': return false; /** @NOTE: unsure */
        //   default: throw e;
        // }
      }
    }
  }
} 