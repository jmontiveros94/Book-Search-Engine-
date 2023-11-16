const jwt = require('jsonwebtoken');

// importing graphql
const { GraphQLError } = require('graphql');

// defines the token secret and expiration
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // handles authentication errors through GraphQLError
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),
  // authorizes the routes 
  authMiddleware: function ({ req }) {
    // allows token to be sent via  req.query or headers
    let token = req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }
    // otherwise error will be thrown here
    if (!token) {
      return req;
    }

    // verifies the user's token in the session otherwise the catch will log the error statment
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }
    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};