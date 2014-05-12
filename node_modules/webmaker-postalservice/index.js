var nunjucks = require("nunjucks"),
    nunjucksEnv = new nunjucks.Environment(
      new nunjucks.FileSystemLoader(__dirname + "/templates/"),
      { autoescape: true }
    ),
    i18n = require("webmaker-i18n"),
    path = require("path");

// Setup locales with i18n
i18n.middleware({
  supported_languages: ["*"],
  default_lang: "en-US",
  translation_directory: path.resolve(__dirname, "locale")
});

nunjucksEnv.addFilter("instantiate", function (input) {
  var tmpl = new nunjucks.Template(input);
  return tmpl.render(this.getVariables());
});

function isLanguageSupport(locale) {
  return i18n.getSupportLanguages().indexOf(locale) !== -1;
};

module.exports = function () {

  var templates = {};

  // Add all templates from templates folder to nunjucks environment
  fs.readdirSync(__dirname + "/templates").forEach(function (file) {
    var name = path.basename(file, ".js");
    templates[name] = nunjucksEnv.getTemplate(file)
  });

  // Render the email
  return function renderEmail(options) {
    options = options || {};

    var template = templates[options.template];
    var locale = isLanguageSupport(options.locale) ? options.locale : "en-US";
    var data = options.data || {};

    data.locale = locale;
    data.gettext = i18n.getStrings(locale);

    return template.render(data);
  };

};
