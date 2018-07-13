const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');
const oauth2 = require('@feathersjs/authentication-oauth2');
const FacebookStrategy = require('passport-facebook');
const { protect } = require('@feathersjs/authentication-local').hooks;
const { discard } = require('feathers-hooks-common');

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
      all: [
        // ctx => {
        //   ctx.params.action = ctx.data.action;
        // },
        // ctx => console.log('auth: all: ctx.params', ctx.params),
        // discard('action'),
        // ctx => console.log('auth: all: ctx.data', ctx.data),
      ],
      create: [authentication.hooks.authenticate(config.strategies)],
      remove: [authentication.hooks.authenticate('jwt')],
    },
    after: {
      create: [
        ctx => {
          ctx.result.user = ctx.params.user;
        },
        // ctx => {
        //   if (ctx.params.user && ctx.params.user.status === 'new')
        // }
        protect('user.password'),
      ],
    },
  });
};

// user signup -> user created -> look at roles -> createe corresponding profile
// user lgoin with teacher/studentflag -> find corresponding profile -> if not exist create a new ONE
