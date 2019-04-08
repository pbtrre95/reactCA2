const mongoose = require('mongoose');

let Event = new mongoose.Schema({
  event_date: Date,
  event_description: String
});

module.exports = mongoose.model('Event', Event);
