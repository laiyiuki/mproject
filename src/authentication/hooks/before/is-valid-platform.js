const { BadRequest } = require('@feathersjs/errors');

module.exports = function isValidPlatform() {
  return async context => {
    const { platform } = context.param.payload;

    if (
      platform !== 'teacher' &&
      platform !== 'student' &&
      platform !== 'admin'
    ) {
      console.log('!!!!!!!!!!!!', platform);

      throw new BadRequest('Invalid platform');
    }

    return context;
  };
};
