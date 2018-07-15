const { authenticate } = require('@feathersjs/authentication').hooks;
const {
  hashPassword,
  protect,
} = require('@feathersjs/authentication-local').hooks;
const {
  // actOnDispatch,
  // alterItems,
  discard,
  disableMultiItemChange,
  disableMultiItemCreate,
  disablePagination,
  disallow,
  iff,
  iffElse,
  isProvider,
  keep,
  paramsFromClient,
  preventChanges,
  skipRemainingHooks,
} = require('feathers-hooks-common');
const { restrictToOwner } = require('feathers-authentication-hooks');

// Common hooks
const isAction = require('../../hooks/is-action');
const noRecordFound = require('../../hooks/no-record-found');

// users: Before hooks
// const verifyPhoneNumber = require('./hooks/before/verify-phone-number');
const isNewUser = require('./hooks/before/is-new-user');
const constructPhone = require('./hooks/before/construct-phone');
const hasRole = require('./hooks/before/has-role');

// users: After hooks
const requestSMSVerifyCode = require('./hooks/after/request-sms-verify-code');
const signIn = require('./hooks/after/sign-in');
const generateProfile = require('./hooks/after/generate-profile');

module.exports = {
  before: {
    all: [paramsFromClient('action')],
    find: [skipRemainingHooks(isAction('phone-sign-up')), authenticate('jwt')],
    get: [iff(isProvider('external'), authenticate('jwt'))],
    create: [
      disableMultiItemCreate(),
      constructPhone(),
      isNewUser(),
      hasRole(),
      hashPassword(),
    ],
    update: [disallow()],
    patch: [
      disableMultiItemChange(),
      iff(isProvider('external'), [
        authenticate('jwt'),
        restrictToOwner({ idField: '_id', ownerField: '_id' }),
        preventChanges('phone'),
      ]),
      hashPassword(),
    ],
    remove: [disableMultiItemChange(), authenticate('jwt')],
  },

  after: {
    all: [protect('password')],
    find: [
      iff(isAction('phone-sign-up'), [
        iffElse(noRecordFound(), requestSMSVerifyCode(), keep('createdAt')),
      ]),
    ],
    get: [],
    create: [generateProfile()],
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
