module.exports = function(lumberyard_messager) {
  var SAWMILL_EVENT = 'event_mentor_confirmation_email';
  var LUMBERYARD_EVENT = 'mailer';
  var EVENTS_FROM_EMAIL = 'Webmaker <help@webmaker.org>';
  var mailroom = require('webmaker-mailroom')();

  return function(id, event, cb) {
    var sendEmail = event.data.sendEmail;
    var username = event.data.username;
    var email = event.data.email;
    var eventName = event.data.eventName;
    var eventUrl = event.data.eventUrl;
    var organizerUsername = event.data.organizerUsername;
    var locale = event.data.locale;
    var confirmUrlYes = event.data.confirmUrlYes;
    var confirmUrlNo = event.data.confirmUrlNo;

    var mail = mailroom.render(SAWMILL_EVENT, {
      username: username,
      eventName: eventName,
      eventUrl: eventUrl,
      organizerUsername: organizerUsername,
      confirmUrlYes: confirmUrlYes,
      confirmUrlNo: confirmUrlNo,
    }, locale);

    if (event.event_type === SAWMILL_EVENT && !(sendEmail === false)) {
      lumberyard_messager.sendMessage({
        event_type: LUMBERYARD_EVENT,
        data: {
          from: EVENTS_FROM_EMAIL,
          to: email,
          subject: mail.subject,
          html: mail.html
        }
      }, cb);
    } else {
      process.nextTick(cb);
    }
  };
};
