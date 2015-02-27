module.exports = function(notifier_messager, spreadsheet, worksheet) {
  var LUMBERYARD_WORKER = "google_spreadsheet";
  return function(event, cb) {
    if (event.event_type === "suggest_featured_resource") {
      var row = {};

      row.username = event.data.username;
      row.email = event.data.email;
      row.link = event.data.link;
      row.webliteracy = event.data.webliteracy;
      row.language = event.data.language;

      notifier_messager.sendMessage({
        event_type: LUMBERYARD_WORKER,
        data: {
          spreadsheet: spreadsheet,
          worksheet: worksheet,
          row: row
        }
      }, cb);

    } else {
      process.nextTick(cb);
    }
  }
}
