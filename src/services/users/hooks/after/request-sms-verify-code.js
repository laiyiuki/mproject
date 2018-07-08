const { promisify } = require('util');
const authy = require('authy');
// https://www.twilio.com/docs/verify/developer-best-practices#explore-the-customization-options

module.exports = function requestSMSVerifyCode() {
  return async context => {
    const { apiKey } = context.app.get('twillio');
    const requestVerifyCode = promisify(
      authy(apiKey).phones().verification_start,
    );

    const { phone, countryCode } = context.params.query;
    const response = await requestVerifyCode(phone, countryCode, {
      via: 'sms',
      locale: 'zh-hk',
      code_length: 4,
    });
    console.log('Twillio response: ', response);

    return context;
  };
};
