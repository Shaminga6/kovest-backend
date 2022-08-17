/**
 * Database instance/connection
 * @note Beacause we are working on existing data, sequelize-auto
 * was used to generate all existing models/tables.
 */

const { Sequelize } = require("sequelize");

// database config
const { database, user, password, host, dialect, port } = require('../config/config').db;

const Database = new Sequelize(database, user, password, {
	host,
	dialect,
	port,
	// operatorsAliases: false,
	logging: false,
});

module.exports = Database;


//b7dbbe90f7f52a:e0906b7d@us-cdbr-east-06.cleardb.net/heroku_0afa7960fe97bf3?