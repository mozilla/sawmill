module.exports = function(notifier_messager) {
  var LUMBERYARD_EVENT = "send_sms";

  return function(id, event, cb) {
    if (event.event_type !== "send_sms") {
      return process.nextTick(cb);
    }

    notifier_messager.sendMessage({
      event_type: LUMBERYARD_EVENT,
      data: {
        to: event.data.to,
        body: event.data.body
      }
    }, cb);
  };
};
