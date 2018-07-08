const { getByDot } = require('feathers-hooks-common');

module.exports = function isAction(tag) {
  return context => getByDot(context.params, 'action') === tag;
};
