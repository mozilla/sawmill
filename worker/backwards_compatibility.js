var BACKWARDS_COMPATIBILITY_MAP = {
  "user_id": "userId",
  "user": "username"
};

module.exports = function(id, event, cb) {
  Object.keys(event.data).forEach(function(key) {
    if (event.data.hasOwnProperty(key) && BACKWARDS_COMPATIBILITY_MAP[key]) {
      event.data[BACKWARDS_COMPATIBILITY_MAP[key]] = event.data[key];
    }
  });
  process.nextTick(cb);
};
