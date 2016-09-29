const async = require('async');
const LUMBERYARD_EVENT = 'mailer';
const FROM_EMAIL = 'The Mozilla Team <donate@mozilla.org>';
const LARGE_DONATION_AMOUNT = 115;
// https://support.stripe.com/questions/which-zero-decimal-currencies-does-stripe-support
const ZERO_DECIMAL_CURRENCIES = [
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

var oxr = require('open-exchange-rates');
var money = require('money');

oxr.set({ app_id: process.env.OXR_APP_ID });

function update_exchange_rates() {
  oxr.latest(function() {
    money.rates = oxr.rates;
    money.base = oxr.base;
  });
}

update_exchange_rates();

// update exchange rates every hour
setInterval(update_exchange_rates, 1000 * 60 * 60);

var to_emails = process.env.LARGE_DONATION_EMAIL;
if (to_emails) {
  to_emails = to_emails.split(' ');
}

module.exports = function(notifier_messager, mailroom) {

  return function(event, cb) {

    if (event.event_type !== 'stripe_charge_succeeded' || !TO_EMAIL) {
      return process.nextTick(cb);
    }

    var amount = event.data.amount;
    var currency = event.data.currency.toUpperCase();

    if (ZERO_DECIMAL_CURRENCIES.indexOf(currency) === -1) {
      amount = amount / 100;
    }

    try {
      amount = money(amount).from(currency).to('USD');
    } catch(fxError) {
      return cb(new Error(`Cannot convert ${amount} ${currency} to USD`));
    }

    if (amount <= LARGE_DONATION_AMOUNT) {
      return process.nextTick(cb);
    }

    var email = `
      <p>A large donation of $${amount} USD was made on donate.mozilla.org.</p>

      <a href="https://dashboard.stripe.com/payments/${event.data.id}">
        click here to review the charge on stripe.com
      </a>
    `;

    async.each(TO_EMAILS, function(to_email, done) {
      notifier_messager.sendMessage({
        event_type: LUMBERYARD_EVENT,
        data: {
          from: FROM_EMAIL,
          to: to_email,
          subject: 'donate.mozilla.org - A large Stripe charge was generated',
          html: email
        }
      }, done);
    }, cb);
  };
};
