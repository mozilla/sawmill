module.exports = function(notifier_messager, mailroom, teach_client_id) {
  var LUMBERYARD_EVENT = "mailer";
  var FROM_EMAIL = 'Webmaker <help@webmaker.org>';

  if (!teach_client_id) {
    teach_client_id = false;
  }

  return function(event, cb) {
    if (event.event_type !== "create_user" || event.data.sendNewUserEmail === false) {
      return process.nextTick(cb);
    }

    var mailTemplate = event.data.client_id === teach_client_id ? "user_created_teach" : "user_created";

    FROM_EMAIL = event.data.teach ? "Mozilla Learning <teachtheweb@mozillafoundation.org>" : FROM_EMAIL;

    var mail = mailroom.render(mailTemplate, {
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
