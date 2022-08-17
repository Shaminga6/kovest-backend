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


