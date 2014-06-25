## Installation

1. Install postgres
2. `cp env.dist .env`
3. `createdb sawmill`
4.  Run `psql -d sawmill -f 201404041717-add-user-events-table.sql` to create the table

## To test events

1. install awscli (`pip install awscli`)
2. `awscli configure` - add your AWS keys
3.  aws sqs send-message --queue-url <queue url> --message-body <json>

## Events

### `event_mentor_confirmation_email`
Include the following data with the hatchet event:

```js
{
  sendEmail: 'if true or undefined, an email will be sent. If false, an email will not be sent.',
  username: 'the username of the event mentor, or undefined if no username exists',
  email: 'the email of the event mentor',
  eventName: 'the name of the event',
  eventUrl: 'the url of the event detail page',
  organizerUsername: 'the username of the event organizer',
  locale: 'the locale of the email (defaults to English)',
  confirmUrlYes: 'the URL for positive confirmation of event mentorship with token',
  confirmUrlNo: 'the URL for negative confirmation of event mentorship with token'
}
```

### `badge_application_denied`
```js
{
  sendEmail: 'if true or undefined, an email will be sent. If false, an email will not be sent.',
  email: 'the email of the applicant',
  locale: 'the locale of the email (defaults to English)',
  badge: 'the badge data, must include "name" and "rubricUrl" property',
  review: 'the review object, must contain "comment" property'
}
```

