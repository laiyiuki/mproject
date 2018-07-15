const { BadRequest } = require('@feathersjs/errors');

module.exports = function hasRoel() {
  return async context => {
    const { roles } = context.data;

    if (!roles || !roles.length) {
      throw new BadRequest('Roles should not be null or empty');
    }

    if (roles.indexOf('teacher') === -1 && roles.indexOf('student') === -1) {
      throw new BadRequest('Invalid role specified');
    }

    return context;
  };
};
