module.exports = function(lumberyard_messenger, mailroom) {
  var SAWMILL_EVENT = 'remind_user_about_event';
  var LUMBERYARD_EVENT = 'mailer';
  var FROM_EMAIL = 'Webmaker <help@webmaker.org>';

  return function(event, cb) {

    if (event.event_type !== SAWMILL_EVENT) {
      return process.nextTick(cb);
    }

    var mail = mailroom.render(SAWMILL_EVENT, {
      username: event.data.username,
      eventAddress: event.data.eventAddress,
      eventDate: event.data.eventDate,
      eventDescription: event.data.eventDescription,
      eventTitle: event.data.eventTitle,
      eventURL: event.data.eventURL,
      organizerEmail: event.data.organizerEmail,
      organizerUsername: event.data.organizerUsername,
    }, event.data.locale);

    lumberyard_messenger.sendMessage({
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
