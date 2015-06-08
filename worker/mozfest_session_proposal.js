module.exports = function(notifier_messager, mailroom) {
  var LUMBERYARD_EVENT = "mailer";
  var FROM_EMAIL = 'MozFest <festival@mozilla.org>';
  var SAWMILL_EVENT = "mozfest_session_proposal"

  return function(event, cb) {
    if (event.event_type !== SAWMILL_EVENT) {
      return process.nextTick(cb);
    }
    var mail = mailroom.render(SAWMILL_EVENT, {}, event.data.locale);

    notifier_messager.sendMessage({
      event_type: LUMBERYARD_EVENT,
      data: {
        from: FROM_EMAIL,
        to: event.data.email,
        subject: mail.subject,
        html: mail.html
      }
    }, cb);
  };
};
