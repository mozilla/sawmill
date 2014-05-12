module.exports = function (sendEmail) {
  return function (id, event, cb) {
    sendEmail(event, cb, {
      eventType: "badge_awarded",
      sendEmailFlag: "sendEmail",
      template: "badge_awarded",
      from: "badges@webmaker.org",
      to: [event.data.email],
      subject: "badgesTitle",
      locale: event.data.locale
    });
  }
};
