module.exports = function(lumberyard_messager, mailroom) {
  var SAWMILL_EVENT = 'event_coorganizer_added';
  var LUMBERYARD_EVENT = 'mailer';
  var EVENTS_FROM_EMAIL = 'Webmaker <help@webmaker.org>';

  return function(id, event, cb) {
    var sendEmail = event.data.sendEmail;
    var email = event.data.email;
    var locale = event.data.locale;
    var data = {
      username = event.data.username,
      eventName = event.data.eventName,
      eventUrl = event.data.eventUrl,
      eventEditUrl: event.data.eventEditUrl
    };

    var mail = mailroom.render(SAWMILL_EVENT, data, locale);

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
