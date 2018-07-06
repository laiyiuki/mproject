const { promisify } = require('util');

module.exports = function () {
  return async context => {
    const { apiKey } = context.app.get('twillio');
    const authy = require('authy')(apiKey);
    const requestVerifyCode = promisify(authy.phones().verification_start);

    const { phone, countryCode } = context.params.query;

    const response = await requestVerifyCode(phone, countryCode, 'sms');
    console.log('Twillio response: ', response);

    return context;
  }
}
