const dotenv = require("dotenv");
const path = require("path");

// load .env
dotenv.config({ path: path.join(__dirname, "../.env") });

// export env vars
const envVars = Object.assign(
	{
		VALID_CORS: "*",
	},
	process.env
);

module.exports = {
	env: envVars.NODE_ENV,
	port: envVars.PORT,
	db: {
		dialect: envVars.DB_DIALECT,
		host: envVars.DB_HOST,
		port: envVars.DB_PORT,
		user: envVars.DB_USER,
		password: envVars.DB_PASSWORD,
		database: envVars.DB_NAME,
	},
	jwt: {
		secret: envVars.JWT_SECRET,
		accessExpirationHours: envVars.JWT_ACCESS_EXPIRATION_HOURS,
		resetPasswordExpirationMinutes:
			envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
		verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
	},
	email: {
		smtp: {
			host: envVars.SMTP_HOST,
			port: envVars.SMTP_PORT,
			auth: {
				user: envVars.SMTP_USERNAME,
				pass: envVars.SMTP_PASSWORD,
			},
		},
		from: envVars.EMAIL_FROM,
	},
	validCors: envVars.VALID_CORS,
};
