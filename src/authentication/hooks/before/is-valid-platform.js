const { BadRequest } = require('@feathersjs/errors');

module.exports = function isValidPlatform() {
  return async context => {
    const { platform } = context.data;
    // console.log('platform', context.data.platform);
    // console.log(typeof platform);
    console.log('platform', context.data.platform);
    if (
      platform !== 'teacher' &&
      platform !== 'student' &&
      platform !== 'admin'
    ) {
      throw new BadRequest('Invalid platform');
    }

    return context;
  };
};
