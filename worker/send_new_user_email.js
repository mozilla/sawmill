module.exports = function(notifier_messager, mailroom) {
  var LUMBERYARD_EVENT = "mailer";
  var FROM_EMAIL = 'Webmaker <help@webmaker.org>';

  return function(id, event, cb) {
    if (event.event_type !== "create_user" || event.data.sendNewUserEmail === false) {
      return process.nextTick(cb);
    }

    var mail = mailroom.render("user_created", {
      username: event.data.username
    }, event.data.locale);

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
