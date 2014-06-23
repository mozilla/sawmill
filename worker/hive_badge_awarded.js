module.exports = function(lumberyard_messager) {
  var SAWMILL_EVENT = 'hive_badge_awarded';
  var LUMBERYARD_EVENT = 'mailer';
  var EVENTS_FROM_EMAIL = 'Webmaker <help@webmaker.org>';
  var mailroom = require('webmaker-mailroom')();

  return function(id, event, cb) {
    var sendEmail = event.data.sendEmail;
    var username = event.data.username;
    var email = event.data.email;
    var locale = event.data.locale;
    var badgeUrl = event.data.badgeUrl;
    var profileUrl = event.data.profileUrl;
    var signUpUrl = event.data.signUpUrl;
    var comments = event.data.comments;

    var mail = mailroom.render(SAWMILL_EVENT, {
      username: username,
      badgeUrl: badgeUrl,
      profileUrl:  profileUrl,
      signUpUrl: signUpUrl,
      comments: comments
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
