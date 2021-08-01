
const { httpTester } = require('./httpTester');
const { youtubeTester } = require('./youtubeTester');

module.exports = {
  testers: {
    [youtubeTester.name]: youtubeTester,
    [httpTester.name]: httpTester,
  },
}