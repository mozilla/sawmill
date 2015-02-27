module.exports = function(lumberyard_messager, mailroom) {
  var SAWMILL_EVENT = 'event_coorganizer_added';
  var LUMBERYARD_EVENT = 'mailer';
  var FROM_EMAIL = 'Webmaker <help@webmaker.org>';

  return function(event, cb) {

    if (event.event_type !== SAWMILL_EVENT || (event.data.sendEmail === false)) {
      return process.nextTick(cb);
    }

    var email = event.data.email;
    var locale = event.data.locale;
    var data = {
      username: event.data.username,
      eventName: event.data.eventName,
      eventUrl: event.data.eventUrl,
      eventEditUrl: event.data.eventEditUrl
    };

    var mail = mailroom.render(SAWMILL_EVENT, data, locale);

    lumberyard_messager.sendMessage({
      event_type: LUMBERYARD_EVENT,
      data: {
        from: FROM_EMAIL,
        to: email,
        subject: mail.subject,
        html: mail.html
      }
    }, cb);

  };
};
