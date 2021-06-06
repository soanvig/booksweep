module.exports = {
  youtubeTester: {
    name: 'youtube',
    pretest (url) {
      return /youtube\.com/.test(url);
    },
    async test (url) {
      /** @TODO */
      return true;
    }
  }
} 