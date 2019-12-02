const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  #limit;
  #total = 0;
  constructor(options) {
    super(options);
    this.#limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    this.#total += chunk.length;
    if (this.#limit >= this.#total) {
      callback(null, chunk);
    } else {
      const err =  new LimitExceededError();
      callback(err);
    }
  }
}

module.exports = LimitSizeStream;
