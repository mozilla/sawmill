# Webmaker mailroom

This module outputs **rendered/localized html** for Webmaker emails given a template name, some arbitrary data, and a locale.

![jbuck the mailman](jbuckmail.png)

## Install
```
npm install webmaker-mailroom
```

## Usage
```
var mailroom = require('webmaker-mailroom');

// Configure
var templateName = 'badge_awarded';
var data = {
  name: 'Kate Hudson',
  faveTeam: 'DFB'
};
var locale = 'en-US';

var email = mailroom.render(templateName, data, locale);
// Output
// email.html: The html of the email body
// email.subject: The subject of the html
```
## List of available templates

### `test`
Data model:
```js
{
  number: "This can be any number, just for testing."
}
```

### `event_mentor_confirmation_email`
Data model:
```js
{
  username: "Can be the event mentor's username or undefined if the email is not associated with a username",
  eventUrl: "The url of the event page",
  eventName: "The name of the event",
  confirmUrlYes: "The tokenized landing page url for a positive confirmation",
  confirmUrlNo: "The tokenized landing page url for a negative confirmation",
  organizerUsername: "The username of the event organizer"
}
```

### `hive_badge_awarded`
Data model:

If a user/username exists:
```js
{
  username: "Badge earner's username",
  badgeUrl: "The complete url of the badge, e.g. https://webmaker.org/badges/hive-community-member",
  profileUrl: "The complete url of the user's profile page e.g. https://webmaker.org/user/user123",
  comments: "The comments included with the approved application"
}
```

If a user/username exists:
```js
{
  badgeUrl: "The complete url of the badge, e.g. https://webmaker.org/badges/hive-community-member",
  signUpUrl: "The complete url where a user can go to sign up for a new badge",
  comments: "The comments included with the approved application"
}
```

## Tests

### Automatic (with mocha)

```
npm install
npm test
```
### Manual tests

```
npm install
node example
```
Then visit http://localhost:1967/<template name> in your browser.

## Adding a new email template

1. If your email event is called "Awesome Event", create an html file in `templates/` called `awesome_event.html`
2. Refer to the [nunjucks templating docs](http://mozilla.github.io/nunjucks/templating.html) for how to add templated data.
3. Add strings to `locale/en_US/strings.json`. In the template, you should use the syntax `{{ 'key-name' | gettext }}`
4. Add a subject to `locale/en_US/strings.json`. The key should be `subject_<template name>`.
5. Add some test data to `test/mock-data.js`. You should format your test data as an array of test data sets, commenting each one if necessary.
6. Manually test your template by running `npm example`. If your html file was `templates/awesome_event.html`, you would navigate to `http://localhost:1967/awesome_event` in your browser.
7. Add automatic tests for your template to `test/test.js` and run `npm test`.
8. Update the 'List of available templates' section in `README.md`  with the event name and data model.

