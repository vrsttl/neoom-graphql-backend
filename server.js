require("dotenv").config();

const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
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

const getUser = id => userData.find(id);

const schema = buildSchema(`
  type Query {
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
`);

const root = {
  user: getUser,
};

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.use((req, res, next) => {
  const allowedOrigins = ["http://127.0.0.1:3000", "http://localhost:3000"];
  const { origin } = req.headers;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.listen(4000);
console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`);
