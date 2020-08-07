const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const expressPlayground = require('graphql-playground-middleware-express').default
const { readFileSync } = require('fs')
const { MongoClient } = require('mongodb')

const { createServer } = require('http')

const depthLimit = require('graphql-depth-limit')
const { createComplexityLimitRule } = require('graphql-validation-complexity')

const path = require('path')
require('dotenv').config()

const resolvers = require('./resolvers')
const typeDefs = readFileSync('./typeDefs.graphql', 'utf-8')

const start  = async() => {
    const app = express() 
    const client = await MongoClient.connect(
        process.env.DB_HOST,
        {
            useUnifiedTopology: true,
            useNewUrlParser : true,
        }
    ) 
    const db = client.db()
    
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        validationRules: [
            depthLimit(10),
            createComplexityLimitRule(10000, {
                onCost: cost => console.log('query cost: ', cost)
            })
        ],
        context: async({ req, connection }) => {
            const token = req ? req.headers.authorization : connection.context.Authorization
            return {db, token}
        }
    })
    server.applyMiddleware({ app })

    app.use('/audio/',express.static(path.join(__dirname,'audio')))

    app.get('/playground',expressPlayground({ endpoint: '/graphql'}))

    const httpServer = createServer(app)
    server.installSubscriptionHandlers(httpServer)
    
    httpServer.timeout = 5000

    httpServer.listen({ port : 7777}, () =>{
        console.log(`GQL Server running at http://localhost:7777${server.graphqlPath}`)
        }
    )
}

start()