require("dotenv").config();

const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const cors = require("cors");
const PORT = process.env.PORT;

const getRandomFloat = (min, max, decimals) => {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
};

const userData = [
  {
    firstName: "Richard",
    lastName: "Clayderman",
    address: "1984 Eighties Drive, 2402 Maria Ellend",
    id: 1,
    usageData: [
      {
        label: "production",
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: "autarchy",
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: "network",
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: "usage",
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: "vehicleCharging",
        value: getRandomFloat(0, 100, 1),
      },
    ],
  },
];

const getUser = args => userData.find(user => user.id === args.id);
const getUsers = () => userData;

const schema = buildSchema(`
  type User {
    firstName: String
    lastName: String
    address: String
    id: Int
    usageData: [UsageData]
  }

  type UsageData {
    label: String
    value: Float 
  }

  type Query {
    user(id: Int!): User
    users: [User]
  }
`);

const root = {
  user: getUser,
  users: getUsers,
};

const app = express();
app.use(
  "/graphql",
  cors(),
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(8000);
console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`);
