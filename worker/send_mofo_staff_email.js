module.exports = function(notifier_messager) {
  var NOTIFIER_EVENT_TYPE = "send_mofo_staff_email";
  return function(id, data, cb) {
    if (data.event_type === "create_event") {
      notifier_messager.sendMessage({
        event_type: NOTIFIER_EVENT_TYPE,
        data: {
          username: data.username,
          email: data.email,
          eventId: data.eventId
        }
      }, cb);
    } else {
      process.nextTick(cb);
    }
  }
}
