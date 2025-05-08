const { client } = require('../utils/db');
const { DataTypes } = require('sequelize');
const { User } = require('./User.model');

const Token = client.define('token', {
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Token.belongsTo(User);
User.hasOne(Token);

module.exports = { Token };
