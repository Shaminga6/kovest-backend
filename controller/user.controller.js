const httpStatus = require("http-status");
const UserModel = require("../models/user.model");
const GoalModel = require("../models/goal.model");
const ApiError = require("../utils/ApiError");
const { objSelective, dataValuesToExempt } = require("../utils/helpers");

const addCard = async (req, res, next) => {
	try {
		const user = res.locals.user;
		const {
			card_number = null,
			card_cvv = null,
			card_expiry = null,
			card_name = null,
		} = req.body;
		if (!card_number || !card_cvv || !card_expiry || !card_name) {
			throw new ApiError(
				httpStatus.BAD_REQUEST,
				"Missing required params in request"
			);
		}
		let validUser = await UserModel.findOne({
			where: { user_id: user },
		});
		if (!validUser) {
			throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
		}
		if (validUser.black_listed !== false) {
			throw new ApiError(
				httpStatus.FORBIDDEN,
				"Your account has been suspended"
			);
		}
		
		if (
			(await validUser.update({
				card_number,
				card_cvv,
				card_expiry,
				card_name,
				has_added_card: true,
			})) 
			&&
			!(await GoalModel.update(
				{
					savings_status: "Active",
				},
				{
					where: {
						user_id: validUser.user_id,
						savings_status: "Pending",
					},
				}
			))
		) {
			throw new ApiError(
				httpStatus.INTERNAL_SERVER_ERROR,
				"Error occurred adding card"
			);
		}
		
		validUser = objSelective(validUser.dataValues, dataValuesToExempt);
		res.send(validUser);
	} catch (error) {
		next(error);
	}
};

const getUser = async (req, res, next) => {
	try {
		const user = res.locals.user;
		
		let validUser = await UserModel.findOne({
			where: { user_id: user },
		});
		
		if (!validUser) {
			throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
		}
		
		if (validUser.black_listed !== false) {
			throw new ApiError(
				httpStatus.FORBIDDEN,
				"Your account has been suspended"
			);
		}
		
		
		validUser = objSelective(validUser.dataValues, dataValuesToExempt);
		res.send(validUser);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	addCard,
	getUser
};
