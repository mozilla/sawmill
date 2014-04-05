module.exports = function(notifier_messager) {
  var NOTIFIER_EVENT_TYPE = "send_event_host_email";
  return function(id, event, cb) {
    if (event.event_type === "create_event" && event.data.sendEventCreationEmails) {
      notifier_messager.sendMessage({
        event_type: NOTIFIER_EVENT_TYPE,
        data: {
          username: event.data.user,
          email: event.data.email
        }
      }, cb);
    } else {
      process.nextTick(cb);
    }
  }
}
