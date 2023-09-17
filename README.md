# Project Management application

## Tech Stack

**Server:** Node, Express, GraphQL, Mongoose
**Client:** React, Apollo Client

## Features

- Create and manage clients:
    - Add new clients with contact information
    - Delete clients when they are no longer needed
- Project management:
    - Create and track multiple projects
    - Assign projects to specific clients
    - Update project details such as name, description, and status
    - Delete projects when completed or no longer relevant


## Run Locally

### Clone the project
```shell
git clone https://github.com/Himanshu8862/project-management-graphql
cd project-management-graphql
```

### Environment Variables
To run this project, you will need to add the following environment variables to your server .env file

```shell
NODE_ENV="development"
PORT=5000
MONGO_URL=<YOUR_DATABASE_CONNECTION_STRING>
```


### Install dependencies
```shell
cd client
npm i
cd ..
cd server
npm i
```

### Start development server

For Frontend
```shell
cd client
npm run dev
```
For Backend

Open another terminal in folder
```shell
cd server
npm run dev
```


## GraphQL Queries & Mutations
Examples of queries and mutations that can be performed on the data using GraphiQL on `http://localhost:5000/graphql`

### Get names of all clients
```shell
{
  clients {
    name
  }
}
```

### Get a single client name and email
```shell
{
  client(id: "1") {
    name
    email
  }
}
```

### Get name and status of all projects
```shell
{
  projects {
    name
    status
  }
}
```

### Get a single project name, description along with the client name and email
```shell
{
  project(id: "1") {
    name
    description,
    client {
      name
      email
    }
  }
}
```

### Create a new client and return all data
```shell
mutation {
  addClient(name: "John Doe", email: "john@gmail.com", phone: "222-222-2222") {
    id
    name
    email
    phone
  }
}
```

### Delete a client and return id
```shell
mutation {
  deleteClient(id: "1") {
    id
  }
}
```

### Create a new project and return name and description
```shell
mutation {
  addProject(name: "Mobile App", description: "This is the project description", status: new, clientId: "1") {
   name
   description
  }
}
```

### Update a project status and return name and status
```shell
mutation {
  updateProject(id:"1", status: completed) {
   name
   status
  }
}
```

### Delete a project and return id
```shell
mutation {
  deleteProject(id: "1") {
    id
  }
}
```
