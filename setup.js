require('dotenv/config');

require('./src/models/User.model');

const { client } = require('./src/utils/db');

client.sync({ force: true });
