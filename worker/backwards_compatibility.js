var BACKWARDS_COMPATIBILITY_MAP = {
  "user_id": "userId",
  "userID": "userId",
  "user": "username"
};

module.exports = function(id, event, cb) {
  Object.keys(event).forEach(function(key) {
    if (event.hasOwnProperty(key) && BACKWARDS_COMPATIBILITY_MAP[key]) {
      event[BACKWARDS_COMPATIBILITY_MAP[key]] = event[key];
    }
  });
  cb();
};
