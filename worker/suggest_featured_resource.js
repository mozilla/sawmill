module.exports = function(notifier_messager) {
  var NOTIFIER_EVENT_TYPE = "suggest_featured_resource";
  return function(id, event, cb) {
    if (event.event_type === NOTIFIER_EVENT_TYPE) {
      var data = {};

      data.username = event.data.username;
      data.email = event.data.email;
      data.link = event.data.link;
      data.webliteracy = event.data.webliteracy;

      notifier_messager.sendMessage({
        event_type: NOTIFIER_EVENT_TYPE,
        data: data
      }, cb);

    } else {
      process.nextTick(cb);
    }
  }
}
