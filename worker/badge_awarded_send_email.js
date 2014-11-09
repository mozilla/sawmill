module.exports = function(lumberyard_messenger, mailroom) {
  var LUMBERYARD_EVENT = "mailer";
  var FROM_EMAIL = 'Webmaker <help@webmaker.org>';
  var webmakerURL = process.env.WEBMAKER_URL;

  return function(id, event, cb) {
    if (event.event_type !== "badge_awarded" || event.data.sendEmail === false) {
      return process.nextTick(cb);
    }

    var mailTom_template,
        fromEmail;

    switch (event.data.badge.slug) {
      case 'webmaker-super-mentor':
        mailroomTemplate = 'super_mentor_badge_awarded';
        fromEmail = 'Michelle Thorne <help@webmaker.org>';
        break;

      case 'skill-sharer':
        mailroomTemplate = 'skill_sharer_badge_awarded';
        fromEmail = 'Webmaker <help@webmaker.org>';
        break;

      case 'event-host':
        mailroomTemplate = 'event_host_badge_awarded';
        fromEmail = 'Webmaker <help@webmaker.org>';
        break;

      case 'teaching-kit-remixer':
        mailroomTemplate = 'teaching_kit_badge_awarded';
        fromEmail = 'Webmaker <help@webmaker.org>';
        break;

      default:
        mailroomTemplate = 'badge_awarded';
        fromEmail = 'Webmaker <help@webmaker.org>';
        break;
    }

    var mail = mailroom.render(mailroomTemplate, {
      username: event.data.username,
      badge: event.data.badge,
      webmakerURL: webmakerURL
    }, event.data.locale);

    notifier_messager.sendMessage({
      event_type: LUMBERYARD_EVENT,
      data: {
        from: fromEmail,
        to: event.data.email,
        subject: mail.subject,
        html: mail.html
      }
    }, cb);
  };
};
