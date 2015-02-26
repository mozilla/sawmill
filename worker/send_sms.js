module.exports = function(notifier_messager, catbox, ttl) {
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

    catbox.get({
      segment: LUMBERYARD_EVENT,
      id: stripNumber(event.data.to)
    }, function(err, cached) {
      if ( err ) {
        return cb(err);
      }
      if ( cached ) {
        return cb();
      }

      catbox.set({
        segment: LUMBERYARD_EVENT,
        id: stripNumber(event.data.to)
      }, true, ttl, function(err) {
        if ( err ) {
          return cb(err);
        }
        send(event.data.to, event.data.body, cb);
      });
    });
  };
};
