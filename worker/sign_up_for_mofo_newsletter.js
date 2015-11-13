var httpRequest = require('request');
var EVENT_TYPE = "sign_up_for_mofo_newsletter";

module.exports = function(event, cb) {
  if (event.event_type === EVENT_TYPE) {
    httpRequest.post(event.data, function() {
      process.nextTick(cb);
    });
  } else {
    process.nextTick(cb);
  }
};
