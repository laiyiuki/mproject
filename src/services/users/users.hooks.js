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
  keep,
  paramsFromClient,
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
const localAuthenticate = require('./hooks/after/local-authenticate');

module.exports = {
  before: {
    all: [paramsFromClient('action')],
    find: [skipRemainingHooks(isAction('sign-up')), authenticate('jwt')],
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
    find: [
      iff(isAction('sign-up'), [
        iffElse(noRecordFound(), requestSMSVerifyCode(), keep('createdAt')),
      ]),
      // iff(isAction('sign-up') && noRecordFound(), requestSMSVerifyCode()),
      // iff(isAction('sign-up') && !noRecordFound(), ctx => console.log('exist')),
    ],
    get: [],
    create: [localAuthenticate()],
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
