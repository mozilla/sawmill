module.exports = function(notifier_messager, mailroom) {
  var MAILER_EVENT = "mailer";
  var FROM_EMAIL = "MozFest <festival@mozilla.org>";
  var EVENT_TYPE = "mozfest_session_proposal_2018"

  return function(event, cb) {
    if (event.event_type !== EVENT_TYPE) {
      return process.nextTick(cb);
    }
    var mail = mailroom.render(EVENT_TYPE, {
      first_name: event.data.first_name,
      github_issue_url: event.data.github_issue_url,
      github_issue_title: event.data.github_issue_title,
      github_program_repo_url: event.data.github_program_repo_url
    }, {
      locale: event.data.locale
    });

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
