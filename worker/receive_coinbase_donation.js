module.exports = function(notifier_messager, mailroom) {
  var LUMBERYARD_EVENT = 'mailer';
  var FROM_EMAIL = 'Mark Surman, Mozilla.org <joinmozilla@mozilla.org>';

  return function(event, cb) {

    if (event.event_type !== "receive_coinbase_donation" ||
        !event.data.order ||
        !event.data.customer ||
        event.data.order.event.type === "expired") {
      return process.nextTick(cb);
    }

    var bitcoin_amount = 0;
    var usd_amount = 0;
    var order = event.data.order;

    if (order.event.type === "completed") {
      bitcoin_amount = order.total_btc.cents;
      usd_amount = order.total_native.cents;
    } else if (order.event.type === "mispayment") {
      order.mispayments.forEach(function(m) {
        if (m.id === order.event.mispayment_id) {
          bitcoin_amount = m.total_btc.cents;
          usd_amount = m.total_native.cents;
        }
      });
    } else {
      return cb(new Error("Couldn't find bitcoin & usd amounts"));
    }

    // Convert Satoshis to Bitcoin and cents to dollars
    bitcoin_amount = bitcoin_amount / 100000000;
    usd_amount = usd_amount / 100;

    var mail = mailroom.render("receive_coinbase_donation", {
      email: event.data.customer.email,
      bitcoin_amount: bitcoin_amount,
      usd_amount: usd_amount,
      transaction_date: event.data.order.created_at
    }, event.data.locale);

    notifier_messager.sendMessage({
      event_type: LUMBERYARD_EVENT,
      data: {
        from: FROM_EMAIL,
        to: event.data.customer.email,
        subject: mail.subject,
        html: mail.html
      }
    }, cb);
  };
};
