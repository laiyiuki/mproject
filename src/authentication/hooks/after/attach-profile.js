module.exports = function attachProfile() {
  return async context => {
    const { platform } = context.data;
    const { user } = context.params;
    console.log('attach profile ');
    if (platform === 'admin') {
      context.result.user = user;
    }

    if (platform === 'teacher') {
      context.result.teacher = await context.app.service('teachers').find({
        query: {
          userId: user._id,
        },
      })[0];
    }

    if (platform === 'students') {
      context.result.teacher = await context.app.service('students').find({
        query: {
          userId: user._id,
        },
      })[0];
    }

    return context;
  };
};
