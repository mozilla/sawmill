module.exports = function(notifier_messager, mailroom) {
  var LUMBERYARD_EVENT = 'mailer';
  var FROM_EMAIL = 'Webmaker <help@webmaker.org>';

  return function(id, event, cb) {

    if (event.event_type !== "login_token_email") {
      return process.nextTick(cb);
    }

    var templateName = event.data.verified === true ? 'login_request' : 'account_confirmation';

    var mail = mailroom.render(templateName, {
      username: event.data.username,
      token: event.data.token,
      loginUrl: event.data.loginUrl
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
