const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');
const oauth2 = require('@feathersjs/authentication-oauth2');
const FacebookStrategy = require('passport-facebook');
const FacebookTokenStrategy = require('passport-facebook-token');
const { protect } = require('@feathersjs/authentication-local').hooks;
const { discard, iff, iffElse, isNot } = require('feathers-hooks-common');

// Before hooks
const isValidPlatform = require('./hooks/before/is-valid-platform');
// After hooks
const attachOrGenerateProfile = require('./hooks/after/attach-or-generate-profile');

const isAuthorization = require('./hooks/is-authorization');

module.exports = function(app) {
  const config = app.get('authentication');

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt());
  app.configure(local());

  console.log('config', config);

  app.configure(
    oauth2(
      Object.assign(
        {
          name: 'facebookTokenTeacher',
          Strategy: FacebookTokenStrategy,
        },
        config.facebookTokenTeacher,
      ),
    ),
  );

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        ctx => console.log('atuh.data', ctx.data),

        iff(isNot(isAuthorization()), isValidPlatform()),
        authentication.hooks.authenticate(config.strategies),
        // ctx => console.log('atuh', ctx.params),
      ],
      remove: [authentication.hooks.authenticate('jwt')],
    },
    after: {
      create: [
        iff(ctx => ctx.params.authenticated, attachOrGenerateProfile()),
        ctx => console.log('atuh', ctx.params),
        protect('user.password', 'profile.password', 'profile.user.password'),
      ],
    },
  });
};
