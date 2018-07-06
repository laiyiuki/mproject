const io = require('socket.io-client');
const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio-client');

const { paramsForServer } = require('feathers-hooks-common');

const run = async () => {
  // feathersClient setup
  const socket = io('http://localhost:3030');
  const client = feathers();
  client.configure(socketio(socket));

  // Services we have
  const userService = client.service('users');


  // Sign up - step 1 check for unique phone num
  // if true: twillio will send you sms with code
  try {
    const res = await userService.find(
      paramsForServer({
        query: { phone: '96344902', countryCode: '852' },
        action: 'sign-up',
      })
    );

    console.log('data', res);
  } catch (err) {
    console.log('err', err);
  }
}

run();
