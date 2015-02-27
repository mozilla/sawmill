module.exports = function(notifier_messager) {
  var NOTIFIER_EVENT_TYPE = "sign_up_for_bsd";
  return function(event, cb) {
    if (event.event_type === "create_user" && event.data.subscribeToWebmakerList) {
      notifier_messager.sendMessage({
        event_type: NOTIFIER_EVENT_TYPE,
        data: {
          email: event.data.email
        }
      }, cb);
    } else {
      process.nextTick(cb);
    }
  }
}
