module.exports = function (notifier_messager, postman) {
  return function sendEmail(event, cb, options) {
    options = options || {};

    if (event.event_type === options.eventType && !(event.data[options.sendEmailFlag] === false)) {

      var mail = {};

      mail.to = options.to;
      mail.from = options.from;
      mail.subject = postman.i18n.gettext(options.subject, options.locale);
      mail.body = postman.render({
        template: options.template,
        locale: options.locale,
        data: event.data
      });

      notifier_messager.sendMessage({
        event_type: "mailer",
        data: mail
      }, cb);

    } else {
      process.nextTick(cb);
    }
  };
};
