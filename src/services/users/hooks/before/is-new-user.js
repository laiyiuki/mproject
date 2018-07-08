const { BadRequest } = require('@feathersjs/errors');

module.exports = function isNewUser() {
  return async context => {
    const { data } = await context.service.find({
      query: {
        phone: '96344902',
        countryCode: '852',
      },
    });

    if (data.length > 0) {
      throw new BadRequest('User already exist');
    }

    return context;
  };
};
