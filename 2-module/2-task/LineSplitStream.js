const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.str = '';
  }

  _transform(chunk, encoding, callback) {
    chunk
      .toString()
      .split('')
      .forEach(part => {
        if (part === '\r' || part === '\n') {
          this.push(this.str);
          this.str = '';
        } else {
          this.str += part;
        }
    });
    callback(null);
  }

  _flush(callback) {
    if (this.str !== '') {
      this.push(this.str);
    }
    callback(null);
  }
}

module.exports = LineSplitStream;
