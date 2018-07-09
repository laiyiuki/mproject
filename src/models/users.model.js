// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
  const mongooseClient = app.get('mongooseClient');
  const users = new mongooseClient.Schema(
    {
      phone: { type: String },
      countryCode: { type: String },
      phoneNumber: { type: String },
      email: { type: String },
      password: { type: String },
      facebookId: { type: String },
      authyId: { type: String },
      hashed_password: { type: String },

      name: { type: String },
      avatar: { type: String },
      birthday: { type: Date },
      gender: { type: String },

      roles: { type: [String] },
      permissions: { type: [String] },

      isStudent: { type: Boolean },
      isTeacher: { type: Boolean },
      status: { type: String, default: 'new' },
    },
    {
      timestamps: true,
    },
  );

  return mongooseClient.model('users', users);
};
