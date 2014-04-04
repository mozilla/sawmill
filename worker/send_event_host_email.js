module.exports = function(config) {
  return function(id, data, cb) {
    process.nextTick(cb);
  }
}
