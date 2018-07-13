const mongoose = require('mongoose');
const { Schema } = mongoose;

const TimeslotSchema = new Schema({
  days: { type: [Number] },
  startTime: { type: String },
  endTime: { type: String },
});

module.exports = TimeslotSchema;
