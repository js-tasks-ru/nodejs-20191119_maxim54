function sum(a, b) {
  if (typeof a === 'number' && typeof b === 'number' && a !== NaN && b !== NaN) {
    return a + b;
  } else {
    throw new TypeError;
  }
}

module.exports = sum;
