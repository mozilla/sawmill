var httpRequest = require('request');
var EVENT_TYPE = "opendataday-petition-signup";
var OPEN_DATA_DAY_SHEET_URL = process.env.OPEN_DATA_DAY_SHEET_URL;

module.exports = function(event, cb) {

  if (event.event_type !== EVENT_TYPE || !OPEN_DATA_DAY_SHEET_URL) {
    return process.nextTick(cb);
  }

  httpRequest.post({
    url: OPEN_DATA_DAY_SHEET_URL,
    form: event.data
  }, function() {
    process.nextTick(cb);
  });
};
