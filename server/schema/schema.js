const Client = require("../models/Client.js")
const Project = require("../models/Project.js")
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
                return Client.findById(parent.clientId);
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
                return Client.find();
            }
        },
        // to get client based on id
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Client.findById(args.id);
            }
        },
        // to get all projects
        projects: {
            type: GraphQLList(ProjectType),
            resolve(parent, args) {
                return Project.find();
            }
        },
        // to get project based on id
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Project.findById(args.id)
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})