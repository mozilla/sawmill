module.exports = function (sendEmail) {
  return function (id, event, cb) {
    sendEmail(event, cb, {
      eventType: "create_user",
      sendEmailFlag: "sendNewUserEmail",
      template: "welcome",
      from: "help@webmaker.org",
      to: [event.data.email],
      subject: "emailTitle",
      locale: event.data.locale
    });
  }
};
