const httpStatus = require("http-status");
const moment = require("moment");
const GoalModel = require("../models/goal.model");
const Notification = require("../models/notification.model");
const TransactionModel = require("../models/transaction.model");
const UserModel = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const { stringHashMatch } = require("../utils/helpers");

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


const liquidate = async (req, res, next) => {
  try {
    const user = res.locals.user
    const {
        goal_id  = null,
        password = null,
    } = req.body
    
    const validUser = await UserModel.findOne({
			where: { user_id: user },
		});
		
		if (!validUser || !(await stringHashMatch(password, validUser.password))) {
			throw new ApiError(
				httpStatus.UNAUTHORIZED,
				"User not found"
			);
		}
		
		if (validUser.black_listed !== false) {
			throw new ApiError(
				httpStatus.FORBIDDEN,
				"Your account has been suspended"
			);
		}
		
		// GET GOAL
    const goals = await GoalModel.findAll({
      where: {
        user_id: user,
        id: goal_id,
        savings_status: 'Active',
        is_liquidated: false,
        black_listed: false,
      }
    })
  
    
    // before liquidating, there are things to take down
  
    // ::if there is a goal to liquidate
    if(goals.length) {
      // ::Get amount saved already, since a user can liquidate any time on flexible
      const aGoal = goals[0];
      
      const ifGoalElapsed = moment(moment().format("YYYY-MM-DDTHH:mm:ss.000[Z]")).isAfter(aGoal.end_date);
      const ifThis = aGoal.amount_saved <= aGoal.amount_to_save && aGoal.type_of_savings.toLowerCase() === "fixed" && !ifGoalElapsed;
      const elseIfThis = aGoal.amount_saved >= aGoal.amount_to_save && aGoal.type_of_savings.toLowerCase() === "fixed" && ifGoalElapsed;
      
      if(ifThis) {
          // Cron must complete goal on fixed savings
          throw new ApiError(
            httpStatus.UNAUTHORIZED,
            "Goal is not ready for liquidation"
          );
      }else if(elseIfThis){
        // Liquidate fixed goals here
        UserModel.update({fixed_savings: 0}, {where: {user_id: aGoal.user_id}}).then(() => {})
        withdraw(aGoal.user_id, aGoal.id, aGoal.goal_title,aGoal.amount_to_save,aGoal.amount_saved)
      }
      
      if(aGoal.type_of_savings.toLowerCase() === "flexible") {
        // When we withdraw, kovest wants to keep track of current balance on the dashboard.
        UserModel.update({flexible_savings:  0}, {where: {user_id: aGoal.user_id}}).then(() => {})
        withdraw(aGoal.user_id, aGoal.id, aGoal.goal_title,aGoal.amount_to_save,aGoal.amount_saved)
      }
      
      res.status(httpStatus.OK).send("widthrawal completed")
    }else {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Unable to liquidate this goal."
      );
    }
  }catch(error) {
    next(error)
  }
}

/**
 * 
 * @param {NUmber} user_id 
 * @param {Number} id 
 * @param {String} goal_title 
 * @param {Number} amount_to_save 
 * @param {Number} remainingAmount 
 */
const withdraw = (user_id,id,goal_title,amount_to_save,remainingAmount) => {
  // update the last checks
  GoalModel.update({is_liquidated: true, goal_completed: true}, {where: {id}}).then(() => {
  
    // If everything goes well
      TransactionModel.create({
        user_id,
        goal_id: id,
        desc: goal_title,
        type: 'liquidation',
        status: 'success',
        goal: amount_to_save,
        amount: remainingAmount
      }).then(() => {})
      
      Notification.create({
        user_id,
        goal_id: id,
        message: "Congratulation, you've successfully liquidate your funds",
        amount: remainingAmount,
        goal: goal_title
      }).then(() => {})
  }).catch(e => {
    // If something went wrong!!
      TransactionModel.create({
        user_id,
        goal_id: id,
        desc: goal_title,
        type: 'liquidation',
        status: 'error',
        goal: amount_to_save,
        amount: remainingAmount
      }).then(() => {})
  })
  
}

module.exports = {
	getTransactions,
	liquidate
};
