/**
 * User model
 */

const { DataTypes } = require("sequelize");
const DB = require("../database");
const bcryptJs = require("bcryptjs");
const md5 = require("md5");

/**
 * @typedef User
 */
const User = DB.define(
	"users",
	{
		id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		user_id: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		first_name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				function(value) {
					if (!/^([a-zA-Z\s]+)([-]?)([a-zA-Z\s]+)$/.test(value)) {
						throw new Error("Special characters are not allowed as first name");
					}
				},
			},
		},
		last_name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				function(value) {
					if (!/^([a-zA-Z\s]+)([-]?)([a-zA-Z\s]+)$/.test(value)) {
						throw new Error("Special characters are not allowed as last name");
					}
				},
			},
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
			validate: {
				isEmail: {
					args: true,
					msg: "Please enter a valid email to proceed",
				},
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				function(value) {
					if (!/^[A-Za-z\d@$!%*#?&]{6,20}$/.test(value)) {
						throw new Error(
							"Password can only contain 6-20 letters, digits and $!%*#?&"
						);
					}
				},
			},
		},
		dob: {
			type: DataTypes.DATEONLY,
			allowNull: false,
			validate: {
				isDate: {
					args: true,
					msg: "Please enter a valid date of birth to proceed",
				},
			},
		},
		gender: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				function(value) {
					if (!/^(female|male|)$/.test(value))
						throw new Error(`Gender can either be "Female" or "Male"`);
				},
			},
		},
		investment_balance: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		fixed_savings: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		flexible_savings: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		email_verified: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		card_number: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		card_cvv: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		card_expiry: {
			type: DataTypes.DATEONLY,
			allowNull: true,
		},
		card_name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		has_added_card: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		role: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "controller",
		},
		black_listed: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		DB,
		tableName: "users",
		timestamps: true,
		indexes: [
			{
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: [{ name: "id" }],
			},
		],
		hooks: {
			afterValidate: async (accountInstance) => {
				try {
					let { password } = accountInstance;
					let salt = await bcryptJs.genSalt(12);
					accountInstance.password = await bcryptJs.hash(password, salt);
				} catch (error) {
					console.error(`Password Hash: `, error);
					throw error;
				}
			},
			afterCreate: async function (_user) {
				try {
					let { id } = _user;
					let encId = md5(id).toString();
					await _user.update({ user_id: encId });
				} catch (error) {
					console.error(`Public id generation:`, error);
					throw error;
				}
			},
		},
	}
);

// WARNING: Passing true to force will drop the existing table from db
User.sync({ force: false })
	.then(() => {})
	.catch((err) => console.error(`User model error: ${err}`));

module.exports = User;
