module.exports = function(notifier_messager) {
  var NOTIFIER_EVENT_TYPE = "badge_awarded_send_email";
  return function(event, cb) {
    if (event.event_type === "badge_awarded" && !(event.data.sendEmail === false)) {
      notifier_messager.sendMessage({
        event_type: NOTIFIER_EVENT_TYPE,
        data: event.data
      }, cb);
    } else {
      process.nextTick(cb);
    }
  };
};
