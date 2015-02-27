module.exports = function(lumberyard_messager, mailroom) {
  var SAWMILL_EVENT = 'hive_badge_awarded';
  var LUMBERYARD_EVENT = 'mailer';
  var EVENTS_FROM_EMAIL = 'Webmaker <help@webmaker.org>';

  return function(event, cb) {

    if (event.event_type !== SAWMILL_EVENT || (event.data.sendEmail === false)) {
      return process.nextTick(cb);
    }

    var username = event.data.username;
    var email = event.data.email;
    var locale = event.data.locale;
    var badgeUrl = event.data.badgeUrl;
    var profileUrl = event.data.profileUrl;
    var signUpUrl = event.data.signUpUrl;
    var comment = event.data.comment;

    var mail = mailroom.render(SAWMILL_EVENT, {
      username: username,
      badgeUrl: badgeUrl,
      profileUrl:  profileUrl,
      signUpUrl: signUpUrl,
      comment: comment
    }, locale);

    lumberyard_messager.sendMessage({
      event_type: LUMBERYARD_EVENT,
      data: {
        from: EVENTS_FROM_EMAIL,
        to: email,
        subject: mail.subject,
        html: mail.html
      }
    }, cb);
  };
};
