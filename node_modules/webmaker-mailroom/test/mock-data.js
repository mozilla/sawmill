module.exports = {
  test: [{
    number: '123'
  }],
  event_mentor_confirmation_email: [
    // This is if the user exists
    {
      username: "webmaker123",
      eventName: "Some Awesome Event",
      confirmUrlYes: "https://events.webmaker.org/confirm/somerandomtoken&confirmation=yes",
      confirmUrlNo: "https://events.webmaker.org/confirm/somerandomtoken&confirmation=no",
      organizerUsername: "k88hudson"
    },
    // This is if the user does not exist
    {
      eventName: "Some Other Awesome Event",
      confirmUrlYes: "https://events.webmaker.org/confirm/somerandomtoken&confirmation=yes",
      confirmUrlNo: "https://events.webmaker.org/confirm/somerandomtoken&confirmation=no",
      organizerUsername: "k88hudson"
    }
  ]
};
