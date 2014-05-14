# Sawmill

This is an app in the MAKE-THIS-THEN-THAT stack. It receives messages from applications that use [hatchet](https://github.com/mozilla/hatchet), and after processing event data into such formats as localized emails, it relays notifications to [lumberyard](https://github.com/mozilla/lumberyard).

## Setup

1. Install redis
2. Install postgres
3. `cp env.dist .env`
4. `createdb sawmill`
5.  Run `psql -d sawmill -f migrations/201404041717-add-user-events-table.sql` to create the table

## Run

Make sure you have [redis](http://redis.io/download) and [postgres](http://www.postgresql.org/download) running.

```
cp env.dist .env
foreman start
```

## Send fake messages

1. install awscli (`pip install awscli`)
2. `awscli configure` - add your AWS keys
3.  aws sqs send-message --queue-url <queue url> --message-body <json>

## Adding new workers

#### 1. Add file to worker/ dir

Add a new file to the `worker/` directory that describes your worker.

For example, let's create a worker that sends email to users when they create an event.

```
worker /
 -- send_event_host_email.js
```

#### 2. Create the worker

Your worker should export a function that takes any dependencies as arguments, and returns a function with the params `id, event, cb`.

Our example uses the `sendEmail` utility, which is passed in to `module.exports`:

```
module.exports = function (sendEmail) {
  return function (id, event, cb) {
    sendEmail(event, cb, {
      eventType: "create_event"
      sendEmailFlag: "sendEventCreationEmails"
      template: "create_event"
      from: "events@webmaker.org",
      to: [event.data.email],
      subject: "Next steps for your event",
      locale: events.data.locale
    });
  }
};
```


#### 3. Add reference to worker series in processor.js

In `processor.js`, look at the code under `// List of Workers`.

Your worker will be available as worker.*filename*, that is the *filename* you defined step one. You should pass any dependencies into this worker, such as the `sendEmail` utility.

In our example, our filename was `send_event_host_email.js`, and we need to inject `sendEmail`:


```
// Dependencies
...
var sendEmail = require("./util/postman")(notifier_messager, postman);
...
// List of workers
var worker = require('./worker');
var workers = async.applyEachSeries([
  worker.send_event_host_email(sendEmail),
  ...
]);
```


