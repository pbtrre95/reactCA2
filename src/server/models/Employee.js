const Employee = require('../models/Employee.js');
const mongoose = require('mongoose');

const EmployeeSchema = mongoose.Schema({
  name: String,
  type: String,
  event_id : String
});

module.exports = mongoose.model('Employee', EmployeeSchema);
