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
        label: "currentProduction",
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: "networkImport",
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: "networkExport",
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: "currentConsumption",
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: "charged",
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: "discharged",
        value: getRandomFloat(0, 100, 1),
      },
    ],
    dailyProduction: [
      {
        label: 0,
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: 1,
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: 2,
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: 3,
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: 4,
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: 5,
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: 6,
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: 7,
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: 8,
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: 9,
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: 10,
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: 11,
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: 12,
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: 13,
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: 14,
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: 15,
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: 16,
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: 17,
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: 18,
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: 19,
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: 20,
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: 21,
        value: getRandomFloat(0, 100, 1),
      },
      {
        label: 22,
        value: getRandomFloat(0, 100, 1),
      },
    ],
  },
];

const getUser = args => {
  const foundUser = userData.find(user => user.id === args.id);
  foundUser.usageData.forEach(datapoint => {
    datapoint.value = getRandomFloat(0, 100, 1);
  });
  if (foundUser.dailyProduction[0].label === 0) {
    for (let i = 0; i < 23; i++) {
      const distanceFromNow = 23 - i;
      const timestamp = Date.now() - distanceFromNow * 3600 * 1000;
      foundUser.dailyProduction[i].label = +timestamp;
    }
    foundUser.dailyProduction.forEach(datapoint => {
      datapoint.value = getRandomFloat(0, 100, 1);
    });
  }
  return foundUser;
};

const getUsers = () => userData;

const schema = buildSchema(`
  type User {
    firstName: String
    lastName: String
    address: String
    id: Int
    usageData: [UsageData]
    dailyProduction: [UsageData]
  }

  type UsageData {
    label: String
    value: Float 
  }

  type Query {
    user(id: Int!): User
    users: [User]
  }

  type Mutation {
    setUserNames(id: Int!, newFirstName: String!, newLastName: String!): User
  }
`);

const root = {
  user: getUser,
  users: getUsers,
  setUserNames: args => {
    const foundUser = getUser(args);
    foundUser.firstName = args.newFirstName;
    foundUser.lastName = args.newLastName;
    return foundUser;
  },
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

app.listen(PORT);
console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`);
