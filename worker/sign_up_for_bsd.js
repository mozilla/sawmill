module.exports = function(notifier_messager) {
  var NOTIFIER_EVENT_TYPE = "sign_up_for_bsd";
  return function(id, data, cb) {
    if (data.event_type === "create_user" && data.subscribeToWebmakerList) {
      notifier_messager.sendMessage({
        event_type: NOTIFIER_EVENT_TYPE,
        data: {
          email: data.email
        }
      }, cb);
    } else {
      process.nextTick(cb);
    }
  }
}
