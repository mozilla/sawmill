var httpRequest = require('request');
var EVENT_TYPE = "send_post_request";

/* Post data format example
{
  url: "https://example.com",
  json: true,
  form: {
    data: "dataz"
  }
}
*/

module.exports = function(event, cb) {
  if (event.event_type === EVENT_TYPE) {
    httpRequest.post(event.data, function() {
      process.nextTick(cb);
    });
  } else {
    process.nextTick(cb);
  }
};
