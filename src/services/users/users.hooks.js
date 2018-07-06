const { authenticate } = require('@feathersjs/authentication').hooks;
const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;
const { iff, paramsFromClient } = require('feathers-hooks-common');

// const isNewUser = require('../../hooks/is-new-user');
const requestSMSVerifyCode = require('./hooks/after/request-sms-verify-code');

module.exports = {
  before: {
    all: [
      paramsFromClient('action'),
    ],
    find: [],
    get: [ authenticate('jwt') ],
    create: [
      // hashPassword(), isNewUser()
    ],
    update: [ hashPassword(),  authenticate('jwt') ],
    patch: [ hashPassword(),  authenticate('jwt') ],
    remove: [ authenticate('jwt') ]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [
      iff(
        ctx => ctx.params.action === 'sign-up' && ctx.result.data.length === 0,
        requestSMSVerifyCode()
      )
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
