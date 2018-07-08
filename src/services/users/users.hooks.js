const { authenticate } = require('@feathersjs/authentication').hooks;
const {
  hashPassword,
  protect,
} = require('@feathersjs/authentication-local').hooks;
const {
  disableMultiItemChange,
  disablePagination,
  iff,
  paramsFromClient,
  skipRemainingHooks,
} = require('feathers-hooks-common');

// Common hooks
const isAction = require('../../hooks/is-action');
const noRecordFound = require('../../hooks/no-record-found');

// users: After hooks
const verifyPhoneNumber = require('./hooks/before/verify-phone-number');
const isNewUser = require('./hooks/before/is-new-user');

// users: After hooks
const requestSMSVerifyCode = require('./hooks/after/request-sms-verify-code');

module.exports = {
  before: {
    all: [paramsFromClient('action')],
    find: [skipRemainingHooks(isAction('sign-up')), authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [isNewUser(), verifyPhoneNumber(), hashPassword()],
    update: [hashPassword(), authenticate('jwt')],
    patch: [
      disableMultiItemChange(),
      hashPassword(),
      // authenticate('jwt')
    ],
    remove: [authenticate('jwt'), disableMultiItemChange()],
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'),
    ],
    find: [iff(isAction('sign-up') && noRecordFound(), requestSMSVerifyCode())],
    get: [],
    create: [
      // ctx => console.log('params', ctx.params),
    ],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
