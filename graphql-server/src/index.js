const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Post = require('./resolvers/Post')
const Comment = require('./resolvers/Comment')
const Tag = require('./resolvers/Tag')


const resolvers = {
    Query,
    Mutation,
    User,
    Post,
    Comment,
    Tag
  }
  

const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient()

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: ({ req }) => {  //Checks if the request has an Authorization header.
    // If yes, it calls getUserId(req) to extract userId from the JWT.
    // If no, userId is set to null (meaning the user is not authenticated).
    return {
      ...req,
      prisma,
    };
  }
});


server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );
  

