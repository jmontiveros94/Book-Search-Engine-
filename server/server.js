// imports express, apolloserver, expressmiddleware, and the path dependencies
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');

// authorization middleware from the auth
const { authMiddleware } = require('./utils/auth');

// imports the schemas and the connection to seed the database
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

// creates new apolloserver with the typedefs and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// starts the apollo server with an async await function and tells it to use the middleware and express
const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // uses graphql with the middleware in the server 
  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

// starts the server and runs it on the local host
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer();