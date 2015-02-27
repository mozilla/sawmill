var BACKWARDS_COMPATIBILITY_MAP = {
  "user_id": "userId",
  "user": "username"
};

var DEFAULT_VALUES = {
  "locale": "en-US"
};

module.exports = function(event, cb) {
  Object.keys(event.data).forEach(function(key) {
    if (event.data.hasOwnProperty(key) && BACKWARDS_COMPATIBILITY_MAP[key]) {
      event.data[BACKWARDS_COMPATIBILITY_MAP[key]] = event.data[key];
    }
  });

  Object.keys(DEFAULT_VALUES).forEach(function(key) {
    if (!event.data.hasOwnProperty(key)) {
      event.data[key] = DEFAULT_VALUES[key];
    }
  });

  process.nextTick(cb);
};
