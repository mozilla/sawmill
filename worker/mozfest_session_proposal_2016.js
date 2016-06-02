module.exports = function(notifier_messager, mailroom) {
  var LUMBERYARD_EVENT = "mailer";
  var FROM_EMAIL = "MozFest <festival@mozilla.org>";
  var SAWMILL_EVENT = "mozfest_session_proposal_2016"

  return function(event, cb) {
    if (event.event_type !== SAWMILL_EVENT) {
      return process.nextTick(cb);
    }
    var mail = mailroom.render(SAWMILL_EVENT, {
      first_name: event.data.first_name,
      github_issue_url: event.data.github_issue_url,
      github_issue_title: event.data.github_issue_title
    }, "en-US");

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
