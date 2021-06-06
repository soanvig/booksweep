const { promises: fs } = require('fs');

module.exports = {
  async fsInput (path) {
    const isFile = (await fs.stat(path)).isFile();
  
    if (!isFile) {
      throw new Error(`${path} is not a file or doesn't exist`);
    }
  
    return JSON.parse(await fs.readFile(path, 'utf-8'));
  }
}