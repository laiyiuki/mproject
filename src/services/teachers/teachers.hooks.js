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

// Before hooks
const extractAndUpdateUserInfo = require('./hooks/before/extract-and-update-user-info');
// After hooks
const saveRoleToUser = require('./hooks/after/save-role-to-user');

const resolvers = require('./resolvers');

module.exports = {
  before: {
    all: [iff(isProvider('external'), [authenticate('jwt')])],
    find: [],
    get: [],
    create: [],
    update: [disallow()],
    patch: [
      // ctx => console.log('tacher: before: patch ', ctx.params.user),
      disableMultiItemChange(),
      // extractAndUpdateUserInfo(),
    ],
    remove: [disableMultiItemChange()],
  },

  after: {
    all: [fastJoin(resolvers)],
    find: [],
    get: [],
    create: [saveRoleToUser()],
    update: [],
    patch: [
      // extractAndUpdateUserInfo(),

      ctx =>
        console.log('333333========= teacher: after: patch ', ctx.params.user),
    ],
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
