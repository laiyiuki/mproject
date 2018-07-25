const { Verifier } = require('@feathersjs/authentication-oauth2');

class CustomVerifier extends Verifier {
  // The verify function has the exact same inputs and
  // return values as a vanilla passport strategy
  verify(req, accessToken, refreshToken, profile, done) {
    // do your custom stuff. You can call internal Verifier methods
    // and reference this.app and this.options. This method must be implemented.
    console.log('--------');
    // console.log('profile', profile);
    // console.log('req', req);

    // const user = null;
    // const payload = null;
    // the 'user' variable can be any truthy value
    // the 'payload' is the payload for the JWT access token that is generated after successful authentication
    // done(null, user, payload);
    ///////////////////////////////////////
    const options = this.options;
    // console.log('options', options);
    const query = {
      [options.idField]: profile.id, // facebookId: profile.id
      $limit: 1,
    };

    const data = { profile, accessToken, refreshToken };
    console.log('data', data);

    // const data = {
    //   facebookId: profile.id,
    //   name: profile
    // }
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
      return this._updateEntity(existing, data)
        .then(entity => done(null, entity))
        .catch(error => (error ? done(error) : done(null, error)));
    }

    // Find or create the user since they could have signed up via facebook.
    this.service
      .find({ query })
      .then(this._normalizeResult)
      .then(
        entity =>
          entity ? this._updateEntity(entity, data) : this._createEntity(data),
      )
      .then(entity => {
        const id = entity[this.service.id];
        const payload = { [`${this.options.entity}Id`]: id };
        done(null, entity, payload);
      })
      .catch(error => (error ? done(error) : done(null, error)));
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
