const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');
const oauth2 = require('@feathersjs/authentication-oauth2');
const FacebookStrategy = require('passport-facebook');
const { protect } = require('@feathersjs/authentication-local').hooks;
const { discard, iff, iffElse, isNot } = require('feathers-hooks-common');

const isValidPlatform = require('./hooks/before/is-valid-platform');

const attachProfile = require('./hooks/after/attach-profile');
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
          name: 'facebook',
          Strategy: FacebookStrategy,
        },
        config.facebook,
      ),
    ),
  );

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        // ctx => console.log('create : data', ctx.data),
        // ctx => console.log('=============='),
        // ctx => console.log('create: params', ctx.params.headers),
        // ctx => console.log('////////////////'),
        // isValidPlatform(),
        // ctx => console.log('=============================\n\n\n'),
        // ctx => console.log(ctx.params),
        // ctx => console.log('=====Before auth ========================\n\n\n'),
        // ctx => console.log(ctx.data),
        // ctx => console.log('params', ctx.params),

        iff(isNot(isAuthorization()), isValidPlatform()),

        authentication.hooks.authenticate(config.strategies),
        // iff(ctx => ctx.params.authenticated, isValidPlatform()),
        // ctx => console.log('=====After auth ========================\n\n\n'),
        // ctx => console.log(ctx.params),
      ],
      remove: [authentication.hooks.authenticate('jwt')],
    },
    after: {
      create: [
        // ctx => console.log('afer create'),
        // iffElse(isAuthorization(), attachProfile(), attachOrGenerateProfile()),
        iff(ctx => ctx.params.authenticated, attachOrGenerateProfile()),
        protect('user.password'),
        // ctx => console.log('after', ctx.result),
      ],
    },
  });
};

// user signup -> user created -> look at roles -> createe corresponding profile
// user lgoin with teacher/studentflag -> find corresponding profile -> if not exist create a new ONE
