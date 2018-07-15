module.exports = function generateProfile() {
  return async context => {
    const { _id, roles } = context.result;

    if (roles.indexOf('teacher') !== -1) {
      await context.app.service('teachers').create({ userId: _id });
      return context;
    }

    if (roles.indexOf('student') !== -1) {
      await context.app.service('students').create({ userId: _id });
      return context;
    }
  };
};
