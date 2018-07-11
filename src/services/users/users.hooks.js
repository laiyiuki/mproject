const { authenticate } = require('@feathersjs/authentication').hooks;
const {
  hashPassword,
  protect,
} = require('@feathersjs/authentication-local').hooks;
const {
  discard,
  disableMultiItemChange,
  disablePagination,
  iff,
  iffElse,
  isProvider,
  keep,
  paramsFromClient,
  preventChanges,
  skipRemainingHooks,
} = require('feathers-hooks-common');

// Common hooks
const isAction = require('../../hooks/is-action');
const noRecordFound = require('../../hooks/no-record-found');

// users: Before hooks
// const verifyPhoneNumber = require('./hooks/before/verify-phone-number');
const isNewUser = require('./hooks/before/is-new-user');
const constructPhone = require('./hooks/before/construct-phone');

// users: After hooks
const requestSMSVerifyCode = require('./hooks/after/request-sms-verify-code');
const signIn = require('./hooks/after/sign-in');

module.exports = {
  before: {
    all: [paramsFromClient('action')],
    find: [skipRemainingHooks(isAction('phone-sign-up')), authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [
      // iff(isAction('verify-phone'), verifyPhoneNumber()),
      // skipRemainingHooks(isAction('verify-phone')),
      constructPhone(),
      isNewUser(),
      hashPassword(),
    ],
    update: [hashPassword(), authenticate('jwt')],
    patch: [
      authenticate('jwt'),
      disableMultiItemChange(),
      iff(isProvider('external'), [preventChanges('phone')]),
      hashPassword(),
    ],
    remove: [authenticate('jwt'), disableMultiItemChange()],
  },

  after: {
    all: [protect('password')],
    find: [
      iff(isAction('phone-sign-up'), [
        iffElse(noRecordFound(), requestSMSVerifyCode(), keep('createdAt')),
      ]),
    ],
    get: [],
    create: [],
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
