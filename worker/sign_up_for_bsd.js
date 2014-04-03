module.exports = function(config) {
  return function(data, cb) {
    process.nextTick(cb);
  }
}
