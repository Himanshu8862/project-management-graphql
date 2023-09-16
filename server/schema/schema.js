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

// Project Type - an object or entity
const ProjectType = new GraphQLObjectType({
    name: "Project",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: ClientType,
            resolve(parent, args){ // parent is project here
                return clients.find(client => client.id === parent.clientId)
            }
        }
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
        },
        // to get all clients
        projects: {
            type: GraphQLList(ProjectType),
            resolve(parent, args) {
                return projects;
            }
        },
        // to get client based on id
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return projects.find(project => project.id === args.id);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})