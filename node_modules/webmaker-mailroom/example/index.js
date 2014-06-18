var express = require('express');
var path = require('path');

var mailer = require('../index.js')();
var mockData = require('../test/mock-data.js');
var app = express();

app.get('/', function (req, res) {
  res.send('To see any of the templates, visit http://localhost:1967/<template-name>');
});

app.get('/:template', function (req, res) {
  var tests = mockData[req.params.template];
  var separator = '\n<hr>\n';
  if (!tests) {
    return res.send('');
  }
  var html = tests.map(function (data) {
    var email = mailer.render(req.params.template, data);
    return '\n<h3>\n' + email.subject + '\n</h3>\n' + email.html
  }).join(separator);
  res.send(html);
});

app.listen(1967, function () {
  console.log('Server listening at http://localhost:1967');  
});
