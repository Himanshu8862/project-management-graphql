const Client = require("../models/Client.js")
const Project = require("../models/Project.js")
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLEnumType
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
        // nested query - getting client of the project
        client: {
            type: ClientType,
            resolve(parent, args) { // parent is project here
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


// Mutations
const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        // Add a client
        addClient: {
            type: ClientType,
            // input agruments
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString), isUnique: true },
                phone: { type: GraphQLNonNull(GraphQLString) },
            },
            // saving client to DB
            async resolve(parent, args) {
                // Check if the email is already in use - done at db level
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                });
                return await client.save();
            },
        },


        // Delete a client
        deleteClient: {
            type: ClientType,
            // input agruments
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            // removing client from DB
            resolve(parent, args) {
                // delete all the projects related to that client
                Project.find({ clientId: args.id })
                    .then((projects) => {
                        projects.forEach(project => {
                            project.deleteOne();
                        });
                    });
                return Client.findByIdAndRemove(args.id);
            },
        },


        // Add a project
        addProject: {
            type: ProjectType,
            // input arguments
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                status: {
                    // Enum - specific values
                    type: new GraphQLEnumType({
                        name: "ProjectStatus",
                        values: {
                            // used at the time of query like, status:new
                            new: { value: "Not Started" },
                            progress: { value: "In Progress" },
                            completed: { value: "Completed" },
                        },
                    }),
                    defaultValue: "Not Started"
                },
                clientId: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                // add project to DB
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId,
                });
                return project.save();
            }
        },


        // Delete a project
        deleteProject: {
            type: ProjectType,
            // input agruments
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            // removing Project from DB
            resolve(parent, args) {
                return Project.findByIdAndRemove(args.id);
            },
        },


        // Update a project
        updateProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                // name, desc and status can be null during update
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: {
                    // Enum - specific values
                    type: new GraphQLEnumType({
                        // IMP - the name has to be unique
                        name: "ProjectStatusUpdate",
                        values: {
                            // used at the time of query like, status:completed
                            new: { value: "Not Started" },
                            progress: { value: "In Progress" },
                            completed: { value: "Completed" },
                        },
                    }),
                },
            },
            resolve(parent, args) {
                return Project.findByIdAndUpdate(args.id, {
                    $set: {
                        name: args.name,
                        description: args.description,
                        status: args.status,
                    }
                }, { new: true })
            }

        },


    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})