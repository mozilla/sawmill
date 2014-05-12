module.exports = function (sendEmail) {
  return function (id, event, cb) {
    sendEmail(event, cb, {
      eventType: "create_event",
      sendEmailFlag: "sendEventCreationEmails",
      template: "create_event",
      from: "events@webmaker.org",
      to: [event.data.email],
      subject: "Next steps for your event",
      locale: event.data.locale
    });
  }
};
