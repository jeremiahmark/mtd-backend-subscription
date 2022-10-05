import { createServer } from "http";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
const { prisma } = require('./prisma/client')

// async function to start server
const startServer = async () => {

  // instance of express and create http server
  const app = express()
  const httpServer = createServer(app)

  // api schema
  const typeDefs = gql`
    type Query {
      boards: [Board]
    }

    type Board {
      id: ID!
      title: String!
      description: String
      path: String!
    }

    type Link {
      description: String!
      id: Int!
      url: String!
    }
  `;

  // resolvers
  const resolvers = {
    Query: {
      boards: () => {
        return prisma.board.findMany()
      }
    },
  };

  // initializing apolloserver
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  })

  // waiting for server to start
  await apolloServer.start()

  // applyinf middleware once server starts
  apolloServer.applyMiddleware({
      app,
      path: '/api'
  })

  // listsening on port
  httpServer.listen({ port: process.env.PORT || 4000 }, () =>
    console.log(`Server listening on localhost:4000${apolloServer.graphqlPath}`)
  )
}

startServer()
