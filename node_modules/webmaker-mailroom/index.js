module.exports = function (options) {
  options = options || {};

  const DEFAULT_LANG = 'en-US';

  var path = require('path');
  var nunjucks = require('nunjucks');
  var i18n = require('webmaker-i18n');

  // Is language supported?
  function isLanguageSupported(locale) {
    return i18n.getSupportLanguages().indexOf(locale) !== -1;
  };

  function gettext(locale) {
    var strings = i18n.getStrings(locale);
    return function (string) {
      return strings[string] || string;
    }
  };

  // Configure nunjucks
  var env = nunjucks.configure(path.resolve(__dirname, 'templates'), { autoescape: true });
  env.addFilter('instantiate', function (input) {
    return nunjucks.renderString(input, this.getVariables());
  });
  env.addFilter('gettext', function (input) {
    return this.lookup('gettext')(input);
  });

  // Setup locales with i18n
  i18n.middleware({
    supported_languages: ['*'],
    default_lang: DEFAULT_LANG,
    translation_directory: path.resolve(__dirname, 'locale')
  });

  return {
    render: function (template, data, locale) {
      var locals = data || {};
      var html;
      var subject;
      locale = isLanguageSupported(locale) ? locale : DEFAULT_LANG;
      locals.gettext = gettext(locale);
      locals.locale = locale;
      try {
        html = nunjucks.render(template + '.html', data);
        subject = nunjucks.renderString(locals.gettext('subject_' + template), data);
        return {
          html: html,
          subject: subject
        };
      } catch (err) {
        return;
      }
    }
  };
};
