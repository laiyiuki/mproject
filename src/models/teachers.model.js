// teachers-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const { Location } = require('./customTypes');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;

  // const location = new Schema({
  //   type: { type: String },
  //   geo: {
  //     type: { type: String, default: 'Point' },
  //     coordinates: { type: [] },
  //   },
  //   district: { type: String },
  //   street: { type: String },
  //   building: { type: String },
  //   floor: { type: String },
  //   unit: { type: String },
  //   block: { type: String },
  // });
  // location.index({ geo: '2dsphere' });


  const timeSession = new Schema({
    days: { type: [String] },
    startTime: { type: Date },
    endTime: { type: Date },
  });


  const teachers = new Schema({

    userId: { type: Schema.Types.ObjectId, required: true },
    role: { type: String },
    organization: { type: String },
    occupation: { type: String },
    educationLevel: { type: String },
    school: { type: String },
    // subjects: { type: [subject] },
    locations: { type: [Location] },
    timePrefs: {type: [timeSession]},
    settings: { ype: Object },
    status: { type: String },

  }, {
    timestamps: true
  });

  return mongooseClient.model('teachers', teachers);
};
