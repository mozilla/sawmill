// https://support.stripe.com/questions/which-zero-decimal-currencies-does-stripe-support
const zeroDecimalCurrencies = [
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

const localesWith2014Email = [
  'az',
  'ca',
  'cs',
  'de',
  'es',
  'es-ES',
  'es-MX',
  'fr',
  'fy-NL',
  'it',
  'ja',
  'ko',
  'nl',
  'pt-BR',
  'pt-PT',
  'ro',
  'sl',
  'sq',
  'sv-SE',
  'zh-CN',
  'zh-TW'
];

var debug = require("debug")("worker:stripe_charge_succeeded");

module.exports = function(notifier_messager, mailroom) {
  const LUMBERYARD_EVENT = 'mailer';
  const FROM_EMAIL = 'The Mozilla Team <donate@mozilla.org>';

  return function(event, cb) {

    if (event.event_type !== 'stripe_charge_succeeded') {
      return process.nextTick(cb);
    }

    const currency_code = event.data.currency.toUpperCase();
    const locale = event.data.customer_object.metadata.locale;

    // If this is a zero decimal currency then use it directly
    // Otherwise divide by 100 to get currency major.minor amount
    let amount = event.data.amount;
    if (zeroDecimalCurrencies.indexOf(currency_code) === -1) {
      amount = amount / 100;
    }
    amount = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency_code
    }).format(amount);

    let template_name = 'stripe_charge_succeeded_2015';
    if (event.data.customer_object.metadata.thunderbird) {
      template_name = 'thunderbird_donation';
    } else if (localesWith2014Email.indexOf(locale) > -1) {
      template_name = 'stripe_charge_succeeded_2014';
    }

    debug(`${event.data.id} - ${!!event.data.invoice ? "recurring" : "one-time"} - ${locale} - ${template_name} - ${amount}`);

    const livemode = event.data.livemode;

    const email = mailroom.render(template_name, {
      livemode,
      amount,
      // If there's an invoice attached to this charge, then it's a subscription
      recurring_donation: !!event.data.invoice,
      transaction_id: event.data.id,
      timestamp: new Date(event.data.created * 1000).toISOString()
    }, {
      locale: locale
    });

    notifier_messager.sendMessage({
      event_type: LUMBERYARD_EVENT,
      data: {
        from: FROM_EMAIL,
        to: event.data.customer_object.email,
        subject: email.subject,
        html: email.html,
        livemode
      }
    }, cb);
  };
};
