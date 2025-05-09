require('dotenv/config');

require('./src/models/User.model');
require('./src/models/Token.model');

const { client } = require('./src/utils/db');

client.sync({ force: true });
