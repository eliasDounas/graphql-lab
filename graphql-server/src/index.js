const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const compression = require('compression');
const http = require('http');

const prisma = new PrismaClient();
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const Post = require('./resolvers/Post');
const Comment = require('./resolvers/Comment');
const Tag = require('./resolvers/Tag');

const resolvers = {
  Query,
  Mutation,
  User,
  Post,
  Comment,
  Tag
};

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

// First, create the Apollo Server
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
    };
  },
  cors: corsOptions,
  compression: true,
  plugins: [
    {
      requestDidStart(requestContext) {
        requestContext.response.http.headers.set('Cache-Control', 'public, max-age=3600');
        requestContext.response.http.headers.set('ETag', 'some-version-hash');
        return {
          didResolveOperation(context) {
            const lastModified = new Date().toUTCString();
            requestContext.response.http.headers.set('Last-Modified', lastModified);
          },
        };
      },
    },
  ],
});

// Create an HTTP server that applies compression
server.createGraphQLServerOptions = async (req, res) => {
  const options = await server.graphQLServerOptions({ req, res });
  
  // Enable compression for this request
  const compressMiddleware = compression();
  
  // Use the middleware on this request
  return new Promise((resolve) => {
    compressMiddleware(req, res, () => {
      resolve(options);
    });
  });
};

// Start the server
server.listen().then(({ url }) => {
  console.log(`Server is running on ${url} with compression enabled`);
});