module.exports = function(notifier_messager, mailroom, staff_email_address) {
  var LUMBERYARD_EVENT = "mailer";
  var FROM_EMAIL = 'Webmaker <help@webmaker.org>';

  return function(event, cb) {
    if (event.event_type !== "create_event" || event.data.sendMofoStaffEmail === false) {
      return process.nextTick(cb);
    }

    var mail = mailroom.render("notify_mofo_staff_new_event", {
      username: event.data.username,
      email: event.data.email,
      eventId: event.data.eventId
    }, event.data.locale);

    notifier_messager.sendMessage({
      event_type: LUMBERYARD_EVENT,
      data: {
        from: FROM_EMAIL,
        to: staff_email_address,
        subject: mail.subject,
        html: mail.html
      }
    }, cb);
  };
};
