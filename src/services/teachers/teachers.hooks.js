const { authenticate } = require('@feathersjs/authentication').hooks;
const {
  disallow,
  discard,
  disableMultiItemChange,
  disablePagination,
  fastJoin,
  iff,
  iffElse,
  isProvider,
  keep,
  paramsFromClient,
  preventChanges,
  skipRemainingHooks,
} = require('feathers-hooks-common');
const {
  restrictToOwner,
  associateCurrentUser,
} = require('feathers-authentication-hooks');

const saveRoleToUser = require('./hooks/after/save-role-to-user');

const resolvers = require('./resolvers');

module.exports = {
  before: {
    all: [
      iff(isProvider('external'), [authenticate('jwt'), restrictToOwner()]),
    ],
    find: [],
    get: [],
    create: [],
    update: [disallow()],
    patch: [disableMultiItemChange()],
    remove: [disableMultiItemChange()],
  },

  after: {
    all: [fastJoin(resolvers)],
    find: [],
    get: [],
    create: [saveRoleToUser()],
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
