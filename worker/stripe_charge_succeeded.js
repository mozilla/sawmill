// https://support.stripe.com/questions/which-zero-decimal-currencies-does-stripe-support
var zeroDecimalCurrencies = [
  'BIF',
  'CLP',
  'DJF',
  'GNF',
  'JPY',
  'KMF',
  'KRW',
  'MGA',
  'PYG',
  'RWF',
  'VND',
  'VUV',
  'XAF',
  'XOF',
  'XPF'
];

var localesWith2015Email = [
  'en-US'
];

module.exports = function(notifier_messager, mailroom) {
  const LUMBERYARD_EVENT = 'mailer';
  const FROM_EMAIL = 'The Mozilla Team <donate@mozilla.org>';

  return function(event, cb) {

    if (event.event_type !== 'stripe_charge_succeeded') {
      return process.nextTick(cb);
    }

    var currency_code = event.data.currency.toUpperCase();
    var locale = event.data.metadata.locale;

    // If this is a zero decimal currency then use it directly
    // Otherwise divide by 100 to get currency major.minor amount
    var amount = event.data.amount;
    if (zeroDecimalCurrencies.indexOf(currency_code) === -1) {
      amount = amount / 100;
    }
    amount = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency_code
    }).format(amount);

    var template_name = 'stripe_charge_succeeded';
    if (localesWith2015Email.indexOf(locale) > -1) {
      template_name = template_name + '_2015';
    } else {
      template_name = template_name + '_2014';
    }

    var email = mailroom.render(template_name, {
      name: event.data.source.name,
      amount: amount,
      // If there's an invoice attached to this charge, then it's a subscription
      // The 2014 variant doesn't display anything different with this parameter
      recurring_donation: !!event.data.invoice,
      address: event.data.source.address_line1,
      city: event.data.source.address_city,
      state: event.data.source.state,
      zipcode: event.data.source.address_zip,
      country: event.data.source.address_country
    }, locale);

    notifier_messager.sendMessage({
      event_type: LUMBERYARD_EVENT,
      data: {
        from: FROM_EMAIL,
        to: event.data.metadata.email,
        subject: email.subject,
        html: email.html
      }
    }, cb);
  };
};
