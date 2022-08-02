const GoalModel = require("../models/goal.model");
const UserModel = require("../models/user.model");
const { objSelective } = require("../utils/helpers");

const getGoals = async (req, res, next) => {
	try {
		const user = res.locals.user;
		const goals = await GoalModel.findAll({
			where: {
				user_id: user,
				black_listed: false,
			},
			attributes: {
				exclude: ["black_listed"],
			},
			order: [["id", "DESC"]],
		});
		res.send(goals);
	} catch (error) {
		next(error);
	}
};

const createGoal = async (req, res, next) => {
	try {
		const user = res.locals.user;
		const {
			goal_title = null,
			amount_to_save = null,
			frequency = null,
			frequency_amount = null,
			type_of_savings = null,
			start_date = null,
			end_date = null,
		} = req.body;
		const validUser = await UserModel.findOne({
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
		let newGoal = await GoalModel.create({
			user_id: user,
			goal_title,
			amount_to_save,
			frequency,
			frequency_amount,
			type_of_savings,
			savings_status: validUser.has_added_card === true ? "Active" : "Pending",
			start_date,
			end_date,
		});
		newGoal = objSelective(newGoal.dataValues, ["black_listed"]);
		res.send(newGoal);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getGoals,
	createGoal,
};
