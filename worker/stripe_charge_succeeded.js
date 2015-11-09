var getCurrencySymbol = require('currency-symbol-map')

module.exports = function(notifier_messager, mailroom) {
  const LUMBERYARD_EVENT = 'mailer';
  const FROM_EMAIL = 'The Mozilla Team <donate@mozilla.org>';

  return function(event, cb) {

    if (event.event_type !== "stripe_charge_succeeded") {
      return process.nextTick(cb);
    }

    var currency_code = event.data.currency.toUpperCase();

    var email = mailroom.render('stripe_charge_succeeded', {
      name: event.data.source.name,
      amount: event.data.amount,
      // If there's an invoice attached to this charge, then it's a subscription
      recurring_donation: !!event.data.invoice,
      currency_symbol: getCurrencySymbol(currency_code),
      currency_code: currency_code,
      address: event.data.source.address_line1,
      city: event.data.source.address_city,
      state: event.data.source.state,
      zipcode: event.data.source.address_zip,
      country: event.data.source.address_country
    }, event.data.locale);

    notifier_messager.sendMessage({
      event_type: LUMBERYARD_EVENT,
      data: {
        from: FROM_EMAIL,
        to: event.data.receipt_email,
        subject: mail.subject,
        html: mail.html
      }
    }, cb);
  };
};
