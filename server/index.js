const express = require("express");
const colors = require("colors")
require("dotenv").config();
const cors = require('cors');
const { graphqlHTTP } = require("express-graphql")
const schema = require("./schema/schema")
const connectDB = require("./config/ConnectDB")
const port = process.env.PORT || 5000;

const app = express();

// conencted to DB
connectDB();

// CORS middleware
app.use(cors())

// single endpoint
app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development"
}))

app.listen(port, console.log(`Server running on port ${port}.`))