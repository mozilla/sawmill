module.exports = function (sendEmail, staffEmail) {
  return function (id, event, cb) {
    sendEmail(event, cb, {
      eventType: "create_event",
      sendEmailFlag: "sendMofoStaffEmail",
      template: "mofo_staff_new_event",
      from: "help@webmaker.org",
      to: [staffEmail],
      subject: "A new event was created",
      locale: "en-US"
    });
  }
};
