module.exports = function(notifier_messager, rateLimiter) {
  var LUMBERYARD_EVENT = "send_sms";

  function send( to, body, cb) {
    notifier_messager.sendMessage({
      event_type: LUMBERYARD_EVENT,
      data: {
        to: to,
        body: body
      }
    }, cb);
  }

  function stripNumber(num) {
    return num.replace(/\+/g, "").replace(/\s/g, "").replace(/-/g, "");
  }

  return function(id, event, cb) {
    if (event.event_type !== LUMBERYARD_EVENT) {
      return process.nextTick(cb);
    }
    if ( !rateLimiter ) {
      return send(event.data.to, event.data.body, cb);
    }

    rateLimiter.isCached({
      segment: LUMBERYARD_EVENT,
      id: stripNumber(event.data.to)
    }, function(cached) {
      if ( cached ) {
        return cb();
      }

      rateLimiter.cache({
        segment: LUMBERYARD_EVENT,
        id: stripNumber(event.data.to)
      }, true, function() {
        send(event.data.to, event.data.body, cb);
      });
    });
  };
};
