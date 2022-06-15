const UserModel = require("../models/user.model");
const { generateAuthToken } = require("../config/jwt");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { objSelective, stringHashMatch } = require("../utils/helpers");
const TokenModel = require("../models/token.model");

const dataValuesToExempt = ["id", "password", "black_listed", "role"];

// login controller
const login = async (req, res, next) => {
	try {
		const { reqIp } = req.custom;
		const { email = null, password = null } = req.body;
		let validUser = await UserModel.findOne({ where: { email } });
		if (!validUser || !(await stringHashMatch(password, validUser.password))) {
			throw new ApiError(
				httpStatus.UNAUTHORIZED,
				"Incorrect login credentials"
			);
		}
		if (validUser.black_listed !== false) {
			throw new ApiError(
				httpStatus.UNAUTHORIZED,
				"Your account has been suspended"
			);
		}
		const genToken = await generateAuthToken(validUser.pub_id, reqIp, true);
		validUser = objSelective(validUser.dataValues, dataValuesToExempt);
		res
			.status(httpStatus.CREATED)
			.send({ user_data: validUser, user_session: genToken });
	} catch (error) {
		next(error);
	}
};

// signup controller
const signUp = async (req, res, next) => {
	try {
		const { reqIp } = req.custom;
		const {
			first_name = null,
			last_name = null,
			email = null,
			password = null,
			dob = null,
			gender,
		} = req.body;
		let newUser = await UserModel.create({
			first_name: first_name?.toString().toLowerCase(),
			last_name: last_name?.toString().toLowerCase(),
			email: email?.toString().toLowerCase(),
			password: password?.toString().toLowerCase(),
			gender: gender?.toString().toLowerCase(),
			dob,
		});
		const genToken = await generateAuthToken(newUser.pub_id, reqIp, true);
		newUser = objSelective(newUser.dataValues, dataValuesToExempt);
		res
			.status(httpStatus.CREATED)
			.send({ user_data: newUser, user_session: genToken });
	} catch (error) {
		next(error);
	}
};

// logout controller
const logout = async (req, res, next) => {
	try {
		const { token = null } = req.body;
		const validToken = await TokenModel.findOne({ where: { token, black_listed: false } });
		if (!validToken) {
			throw new ApiError(httpStatus.NOT_FOUND, "Token not found");
		}
		await validToken.update({ black_listed: true });
		res.status(httpStatus.OK).send('Session logged out');
	} catch (error) {
		next(error);
	}
};

module.exports = {
	login,
	signUp,
	logout,
};
