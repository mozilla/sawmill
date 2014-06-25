module.exports = function(lumberyard_messager, mailroom) {
  var SAWMILL_EVENT = 'badge_application_denied';
  var LUMBERYARD_EVENT = 'mailer';
  var FROM_EMAIL = 'Webmaker <help@webmaker.org>';

  return function(id, event, cb) {
    var sendEmail = event.data.sendEmail;
    var email = event.data.email;
    var locale = event.data.locale;
    var badge = event.data.badge;
    var comment = event.data.review.comment;

    var mail = mailroom.render(SAWMILL_EVENT, {
      badgeName: badge.name,
      badgeUrl: badge.rubricUrl,
      comment: comment
    }, locale);

    if (event.event_type !== SAWMILL_EVENT || (sendEmail === false)) {
      return process.nextTick(cb);
    }

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
