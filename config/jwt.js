const httpStatus = require("http-status");
const jsonWebToken = require("jsonwebtoken");
const moment = require("moment");
const { jwt } = require("./config");
const ApiError = require("../utils/ApiError");
const TokenModel = require("../models/token.model");
const { tokenTypes } = require("./tokens");

// Generate token handler func
const createToken = (userPubId, expires, type, secret = jwt.secret) => {
	const payload = {
		sub: userPubId,
		iat: moment().unix(),
		exp: expires.unix(),
		type,
	};
	return jsonWebToken.sign(payload, secret);
};

// Store token handler func
const storeToken = async (userPubId, token, expires, type, reqIp) => {
	return TokenModel.create({
		token,
		user: userPubId,
		expires: expires.toDate(),
		type,
		req_ip: reqIp,
	});
};

// Generate auth token
const generateAuthToken = async (userPubId, reqIp, store = false) => {
	try {
		const accessTokenExpires = moment().add(jwt.accessExpirationHours, "hours");
		const accessToken = createToken(
			userPubId,
			accessTokenExpires,
			tokenTypes.ACCESS
		);
		if (store) {
			await storeToken(
				userPubId,
				accessToken,
				accessTokenExpires,
				tokenTypes.ACCESS,
				reqIp
			);
		}
		return {
			token: accessToken,
			expires: accessTokenExpires.toDate(),
		};
	} catch (error) {
		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
	}
};

// function to extract tokex from req authorization header
const extractToken = (req) => {
	if (
		req.headers.authorization &&
		/^([Bb]earer)\s(.+)$/.test(req.headers.authorization)
	) {
		return req.headers.authorization.split(" ")[1];
	} else {
		return null;
	}
};

// Verify token and return token (or throw an error if it is not valid)
const verifyToken = async (token) => {
	const { sub, type, exp } = jsonWebToken.verify(token, jwt.secret);
	// const validToken = await TokenModel.findOne({
	// 	where: { token, type, user: sub, black_listed: false },
	// });
	// if (!validToken) {
	// 	throw new ApiError(httpStatus.UNAUTHORIZED, "Token not found");
	// }
	// return validToken;
	return sub;
};

// function to verify session/access token
const authVerify = async (req, res, next) => {
	let token;
	try {
		token = extractToken(req);
		if (!token) {
			throw new Error("Invalid authorization token");
		}
		const isValidToken = await verifyToken(token);
		// res.locals.user = isValidToken.user;
		res.locals.user = isValidToken;
		next();
	} catch (error) {
		if ("TokenExpiredError" === error.name) {
			TokenModel.findOne({
				where: { token, black_listed: false },
			}).then((_token) => {
				_token?.update({ black_listed: true });
			});
			error.message = "Session token expired";
		}
		error.statusCode = httpStatus.UNAUTHORIZED;
		next(error);
	}
};

module.exports = {
	authVerify,
	generateAuthToken,
};
