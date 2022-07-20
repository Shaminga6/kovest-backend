/**
 * Goal model
 */

const { DataTypes } = require("sequelize");
const DB = require("../database");

/**
 * @typedef Token
 */
const Goal = DB.define(
	"goals",
	{
		id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		goal_title: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		user_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		amount_saved: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		amount_to_save: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		frequency: {
			type: DataTypes.ENUM(["Daily", "Weekly", "Monthly"]),
			allowNull: false,
		},
		frequency_amount: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		type_of_savings: {
			type: DataTypes.ENUM(["Fixed", "Flexible"]),
			allowNull: false,
		},
		savings_status: {
			type: DataTypes.ENUM(["Pending", "Active"]),
			allowNull: false,
		},
		start_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		end_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		method_of_savings: {
			type: DataTypes.STRING,
			defaultValue: "Card",
			allowNull: false,
		},
		is_liquidated: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		black_listed: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		DB,
		tableName: "goals",
		timestamps: true,
		indexes: [
			{
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: [{ name: "id" }],
			},
		],
	}
);

// WARNING: Passing true to force will drop the existing table from db
Goal.sync({ force: false })
	.then(() => {})
	.catch((err) => console.error(`Token model error: ${err}`));

module.exports = Goal;
