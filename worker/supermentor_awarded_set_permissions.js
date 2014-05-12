module.exports = function(notifier_messager) {
  var NOTIFIER_EVENT_TYPE = "supermentor_awarded_set_permissions";
  var MENTOR_BADGE_SLUG = 'webmaker-super-mentor';
  return function(id, event, cb) {
    if (event.event_type === "badge_awarded" && event.data.badge.slug === MENTOR_BADGE_SLUG) {
      notifier_messager.sendMessage({
        event_type: NOTIFIER_EVENT_TYPE,
        data: event.data
      }, cb);
    } else {
      process.nextTick(cb);
    }
  };
};
