const mongoose = require('mongoose');
const { Schema } = mongoose;

const LocationSchema = new Schema({
  category: { type: String },
  geo: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [] },
  },
  district: { type: String },
  street: { type: String },
  building: { type: String },
  block: { type: String },
  floor: { type: String },
  unit: { type: String },
});

LocationSchema.index({ geo: '2dsphere' });

module.exports = LocationSchema;
