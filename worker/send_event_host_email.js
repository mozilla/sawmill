module.exports = function(notifier_messager) {
  var NOTIFIER_EVENT_TYPE = "send_event_host_email";
  return function(id, data, cb) {
    if (data.event_type === "create_event" && data.sendEventCreationEmails) {
      notifier_messager.sendMessage({
        event_type: NOTIFIER_EVENT_TYPE,
        data: {
          username: data.user,
          email: data.email
        }
      }, cb);
    } else {
      process.nextTick(cb);
    }
  }
}
