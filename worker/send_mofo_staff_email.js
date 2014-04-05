module.exports = function(notifier_messager) {
  var NOTIFIER_EVENT_TYPE = "send_mofo_staff_email";
  return function(id, event, cb) {
    if (event.event_type === "create_event") {
      notifier_messager.sendMessage({
        event_type: NOTIFIER_EVENT_TYPE,
        data: {
          username: event.data.username,
          email: event.data.email,
          eventId: event.data.eventId
        }
      }, cb);
    } else {
      process.nextTick(cb);
    }
  }
}
