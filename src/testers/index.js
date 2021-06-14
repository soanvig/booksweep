
const { httpTester } = require('./httpTester');
const { youtubeTester } = require('./youtubeTester');

module.exports = {
  testers: {
    [httpTester.name]: httpTester,
    [youtubeTester.name]: youtubeTester,
  },
}