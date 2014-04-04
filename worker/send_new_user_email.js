module.exports = function(notifier_messager) {
  var NOTIFIER_EVENT_TYPE = "send_new_user_email";
  return function(id, data, cb) {
    if (data.event_type === "create_user") {
      notifier_messager.sendMessage({
        event_type: NOTIFIER_EVENT_TYPE,
        data: {
          username: data.username,
          email: data.email
        }
      }, cb);
    } else {
      process.nextTick(cb);
    }
  }
}
