const { clients, projects } = require("../SampleData.js")
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLSchema,
    GraphQLList
} = require("graphql")

// Client Type - an object or entity
const ClientType = new GraphQLObjectType({
    name: "Client",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
})

// jumping in point on the graph to reslove queries
const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        // to get all clients
        clients: {
            type: GraphQLList(ClientType),
            resolve(parent, args) {
                return clients;
            }
        },
        // to get client based on id
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return clients.find(client => client.id === args.id);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})