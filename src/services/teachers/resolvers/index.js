const userResolver = {
  joins: {
    user: userId => record => 
    author: ...,
    starers: fieldNames => record => /* modify record */,
    comments: {
      resolver: ...,
      joins: {
        author: ...,
      }
    },
  }
};

module.exports = userResolver;
