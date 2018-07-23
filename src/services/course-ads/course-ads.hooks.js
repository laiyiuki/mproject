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
    all: [
      iff(isProvider('external'), [authenticate('jwt')]),
      paramsFromClient('action', 'paginate'),
    ],
    find: [],
    get: [
      iff(isProvider('external'), [
        restrictToOwner({ idField: 'teacherId', ownerField: 'teacherId' }),
      ]),
    ],
    create: [
      ctx =>
        console.log('888888888 course ads: before: patch ', ctx.params.user),
      associateCurrentUser({ idField: 'teacherId', as: 'teacherId' }),
      // ctx => console.log('create course ad data', ctx.params.user),
    ],
    update: [disallow()],
    patch: [
      // ctx => console.log('course: before: patch ', ctx.params.user),
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
    patch: [
      ctx => console.log('========= course: after: patch ', ctx.params.user),
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
