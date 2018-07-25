const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');
const oauth2 = require('@feathersjs/authentication-oauth2');
const FacebookStrategy = require('passport-facebook');
const FacebookTokenStrategy = require('passport-facebook-token');
const { protect } = require('@feathersjs/authentication-local').hooks;
const { discard, iff, iffElse, isNot } = require('feathers-hooks-common');

const CustomVerifier = require('./verifier');

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
  app.configure(
    oauth2(
      Object.assign(
        {
          name: 'facebookTokenTeacher',
          Strategy: FacebookTokenStrategy,
          Verifier: CustomVerifier,
        },
        config.facebookTokenTeacher,
      ),
    ),
  );

  // console.log(
  //   'oauth',
  //   Object.assign(
  //     {
  //       name: 'facebookTokenTeacher',
  //       Strategy: FacebookStrategy,
  //       Verifier: CustomVerifier,
  //     },
  //     config.facebookTokenTeacher,
  //   ),
  // );

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        // ctx => (ctx.params.payload.platform = ctx.data.platform),
        // ctx => console.log('0 auth data', ctx.data),
        // ctx => console.log('1 auth params', ctx.params),
        // ctx => console.log('=================='),
        // ctx => console.log('=================='),

        // iff(isNot(isAuthorization()), isValidPlatform()),
        authentication.hooks.authenticate(config.strategies),
        // ctx => console.log('2 auth before data', ctx.data),
        // ctx => console.log('3 auth before params', ctx.params),
        // ctx => console.log('=================='),
        // ctx => console.log('=================='),

        // iff(isNot(isAuthorization()), isValidPlatform()),
      ],
      remove: [authentication.hooks.authenticate('jwt')],
    },
    after: {
      create: [
        // ctx => console.log('------'),
        // ctx => console.log('4 auth after params', ctx.params),
        // ctx => console.log('auth after dara', ctx.data),

        iff(ctx => ctx.params.authenticated, attachOrGenerateProfile()),
        protect('user.password', 'profile.password', 'profile.user.password'),
      ],
    },
  });
};
