module.exports = function(notifier_messager, mailroom) {
  var MAILER_EVENT = 'mailer';
  var FROM_EMAIL = 'Webmaker <help@webmaker.org>';

  return function(event, cb) {

    if (event.event_type !== "reset_code_created") {
      return process.nextTick(cb);
    }

    var mail = mailroom.render('reset_request', {
      resetUrl: event.data.resetUrl
    }, event.data.locale);

    notifier_messager.sendMessage({
      event_type: MAILER_EVENT,
      data: {
        from: FROM_EMAIL,
        to: event.data.email,
        subject: mail.subject,
        html: mail.html
      }
    }, cb);
  };
};
