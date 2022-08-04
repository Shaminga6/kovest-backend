const httpStatus = require("http-status");
const TransactionModel = require("../models/transaction.model");
const ApiError = require("../utils/ApiError");

const getTransactions = async (req, res, next) => {
	try {
		const user = res.locals.user;
		const goal_id = typeof(req.query.goal_id) === 'string' ? req.query.goal_id : null;
		
		if(typeof(goal_id) === "object") throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid queryname, use 'goal_id' instead");
		
		const transaction = await TransactionModel.findAll({
			where: {
				user_id: user,
				goal_id: goal_id
			},
		});
		res.send(transaction);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getTransactions,
};
