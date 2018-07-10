module.exports = function(options = {}) {
  return function hello(req, res, next) {
    console.log('hello middleware is running');
    console.log(app.get('twillio'));
    next();
  };
};
