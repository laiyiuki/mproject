const { LocationSchema, TimeslotSchema } = require('./customTypes');

module.exports = function(app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const courseAds = new Schema(
    {
      teacherId: { type: Schema.Types.ObjectId, required: true },
      title: { type: String, required: true },
      timeslots: { type: [TimeslotSchema] },
      location: { type: LocationSchema },

      duration: { type: Number, required: true },
      fee: { type: Number, required: true },
      currency: { type: String, required: true, default: 'hkd' },
      acceptMultiStudent: { type: Boolean },
      additionalCostPerHead: { type: Number },

      description: { type: String },
      images: { type: [String] },

      homeTuition: { type: Boolean },
      offerTrial: { type: Boolean },
      minAge: { type: Number },
      maxAge: { type: Number },

      status: { type: String, required: true, default: 'new' }, // online / offline
    },
    {
      timestamps: true,
    },
  );

  return mongooseClient.model('courseAds', courseAds);
};
