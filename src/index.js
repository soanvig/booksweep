require('dotenv').config();

const cluster = require('cluster');
const { masterProcessor } = require('./processors/master');
const { workerProcessor } = require('./processors/worker');

if (cluster.isMaster) {
  masterProcessor();
} else {
  workerProcessor();
}
