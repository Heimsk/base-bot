const Client = require('./src/structures/Client');
const { config } = require('dotenv');
config();
const client = new Client(process.env.TOKEN, {
  restMode: true,
  rest: {
    baseURL: "/api/v9"
  },
  slashCommands: true
});

(async () => {
  await client.start();
})();