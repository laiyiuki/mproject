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

const resolvers = require('./resolvers');

module.exports = {
  before: {
    all: [iff(isProvider('external'), [authenticate('jwt')])],
    find: [],
    get: [
      iff(isProvider('external'), [
        restrictToOwner({ idField: 'teacherId', ownerField: 'teacherId' }),
      ]),
    ],
    create: [],
    update: [disallow()],
    patch: [
      disableMultiItemChange(),
      iff(isProvider('external'), [
        restrictToOwner({ idField: 'teacherId', ownerField: 'teacherId' }),
      ]),
    ],
    remove: [disableMultiItemChange()],
  },

  after: {
    all: [fastJoin(resolvers)],
    find: [],
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
