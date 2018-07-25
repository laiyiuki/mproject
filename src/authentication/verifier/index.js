const { Verifier } = require('@feathersjs/authentication-oauth2');

class CustomVerifier extends Verifier {
  async verify(req, accessToken, refreshToken, profile, done) {
    const app = this.app;
    const options = this.options;
    console.log('profile._json', profile._json);
    const query = {
      [options.idField]: profile.id, // facebookId: profile.id
      $limit: 1,
    };

    let existing;

    if (this.service.id === null || this.service.id === undefined) {
      // debug('failed: the service.id was not set');
      return done(
        new Error(
          'the `id` property must be set on the entity service for authentication',
        ),
      );
    }

    // Check request object for an existing entity
    if (req && req[options.entity]) {
      existing = req[options.entity];
      console.log('existing', existing);
    }

    // Check the request that came from a hook for an existing entity
    if (!existing && req && req.params && req.params[options.entity]) {
      existing = req.params[options.entity];
    }

    // If there is already an entity on the request object (ie. they are
    // already authenticated) attach the profile to the existing entity
    // because they are likely "linking" social accounts/profiles.
    if (existing) {
      // const user = await app.service(options.service).get(existing);
      // return done(null, user);
      // return this._updateEntity(existing, data)
      //   .then(entity => done(null, entity))
      //   .catch(error => (error ? done(error) : done(null, error)));
    }

    try {
      const { data } = await app.service(options.service).find({ query });
      if (data.length > 0) {
        const payload = {
          [`${this.options.entity}Id`]: data[0]._id,
        };
        return done(null, data, payload);
      }

      const user = await app.service(options.service).create({
        facebookId: profile.id,
        name: profile.displayName,
        email: profile.email[0].value,
      });
      const payload = {
        [`${this.options.entity}Id`]: user._id,
      };
      return done(null, user, payload);
    } catch (err) {
      return done(err);
    }
  }
}

module.exports = CustomVerifier;

/**
verify (req, accessToken, refreshToken, profile, done) {
  debug('Checking credentials');
  const options = this.options;
  const query = {
    [options.idField]: profile.id, // facebookId: profile.id
    $limit: 1
  };
  const data = { profile, accessToken, refreshToken };
  let existing;

  if (this.service.id === null || this.service.id === undefined) {
    debug('failed: the service.id was not set');
    return done(new Error('the `id` property must be set on the entity service for authentication'));
  }

  // Check request object for an existing entity
  if (req && req[options.entity]) {
    existing = req[options.entity];
  }

  // Check the request that came from a hook for an existing entity
  if (!existing && req && req.params && req.params[options.entity]) {
    existing = req.params[options.entity];
  }

  // If there is already an entity on the request object (ie. they are
  // already authenticated) attach the profile to the existing entity
  // because they are likely "linking" social accounts/profiles.
  if (existing) {
    return this._updateEntity(existing, data)
      .then(entity => done(null, entity))
      .catch(error => error ? done(error) : done(null, error));
  }

  // Find or create the user since they could have signed up via facebook.
  this.service
    .find({ query })
    .then(this._normalizeResult)
    .then(entity => entity ? this._updateEntity(entity, data) : this._createEntity(data))
    .then(entity => {
      const id = entity[this.service.id];
      const payload = { [`${this.options.entity}Id`]: id };
      done(null, entity, payload);
    })
    .catch(error => error ? done(error) : done(null, error));
}
*/
