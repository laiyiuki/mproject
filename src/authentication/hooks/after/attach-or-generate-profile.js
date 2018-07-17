module.exports = function attachOrGenerateProfile() {
  return async context => {
    const { platform } = context.data;
    const { user } = context.params;

    let profile;

    if (platform === 'admin') {
      profile = user;
    }

    if (platform === 'teacher') {
      if (user.roles.indexOf('teacher') === -1) {
        profile = await context.app
          .service('teachers')
          .create({ userId: user._id, roles: { $push: 'teacher' } });
      } else {
        const data = await context.app.service('teachers').find({
          query: {
            userId: user._id,
          },
          paginate: false,
        });

        profile = data[0];
      }
    }

    if (platform === 'students') {
      if (user.roles.indexOf('teacher') === -1) {
        profile = await context.app
          .service('students')
          .create({ userId: user._id });
      } else {
        const data = await context.app.service('students').find({
          query: {
            userId: user._id,
          },
          paginate: false,
        });

        profile = data[0];
      }
    }

    context.result.profile = { ...profile };
    return context;
  };
};
