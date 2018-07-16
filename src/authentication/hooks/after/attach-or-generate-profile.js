module.exports = function attachOrGenerateProfile() {
  return async context => {
    const { platform } = context.data;
    const { user } = context.params;
    console.log('attach or generate ');
    if (platform === 'admin') {
      context.result.user = user;
      return context;
    }

    if (platform === 'teacher') {
      if (user.roles.indexOf('teacher') === -1) {
        console.log('gen teacher');
        context.result.teacher = await context.app
          .service('teachers')
          .create({ userId: user._id, roles: { $push: 'teacher' } });
      } else {
        console.log('find teacher');

        const data = await context.app.service('teachers').find({
          query: {
            userId: user._id,
          },
          paginate: false,
        });
        context.result.teacher = data[0];
      }
      return context;
    }

    if (platform === 'students') {
      if (user.roles.indexOf('teacher') === -1) {
        context.result.student = await context.app
          .service('students')
          .create({ userId: user._id });
      } else {
        const data = await context.app.service('students').find({
          query: {
            userId: user._id,
          },
          paginate: false,
        });
        context.result.student = data[0];
      }
      return context;
    }
  };
};
