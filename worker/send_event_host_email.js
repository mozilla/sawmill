module.exports = function(notifier_messager, mailroom) {
  var LUMBERYARD_EVENT = "mailer";
  var FROM_EMAIL = 'Amira <help@webmaker.org>';

  return function(event, cb) {
    if (event.event_type === "create_event" && event.data.sendEventCreationEmails) {

      var activity_type;
      var mail;
      var tags = event.data.eventTags;

      if (Array.isArray(tags) && tags.indexOf("wizard") !== -1 && tags.indexOf("meme") !== -1) {
        activity_type = "meme";
      } else if (Array.isArray(tags) && tags.indexOf("wizard") !== -1 && tags.indexOf("privacy") !== -1) {
        activity_type = "privacy";
      } else if (Array.isArray(tags) && tags.indexOf("wizard") !== -1 && tags.indexOf("video") !== -1) {
        activity_type = "video";
      }

      if (activity_type) {
        mail = mailroom.render("webmaker_activity", {
          activity_type: activity_type,
          eventDate: event.data.eventDate,
          username: event.data.username
        }, event.data.locale);
      } else {
        mail = mailroom.render("event_created", {
          username: event.data.username
        }, event.data.locale);
      }

      notifier_messager.sendMessage({
        event_type: LUMBERYARD_EVENT,
        data: {
          from: FROM_EMAIL,
          to: event.data.email,
          subject: mail.subject,
          html: mail.html
        }
      }, cb);
    } else {
      process.nextTick(cb);
    }
  };
};
