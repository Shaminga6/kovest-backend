/**
 * Token model
 */

const { DataTypes } = require('sequelize');
const DB = require('../database');
const { tokenTypes } = require('../config/tokens');

/**
 * @typedef Token
 */
const Token = DB.define(
  'tokens',
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    user: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM([tokenTypes.ACCESS, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL]),
      allowNull: false,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    req_ip: {
      type: DataTypes.STRING,
    },
    black_listed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    DB,
    tableName: 'tokens',
    timestamps: true,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'id' }],
      },
    ],
  }
);

// WARNING: Passing true to force will drop the existing table from db
Token.sync({ force: false })
  .then(() => {})
  .catch((err) => console.error(`Token model error: ${err}`));

module.exports = Token;
