// Get Dependencies
const moment = require("moment");
const { Op } = require("sequelize");
const GoalModel = require("../models/goal.model");
const Notification = require("../models/notification.model");
const TransactionModel = require("../models/transaction.model");


const today = moment().format("YYYY-MM-DDTHH:mm:ss.000[Z]"); // gives a better date format.

const runTransaction = (frequency) => {
  _(frequency)
}

const _ = async(frequency) => {
  try {
    const goals = await GoalModel.findAll({
      where: {
        frequency,
        savings_status: 'Active',
        is_liquidated: false,
        black_listed: false,
        start_date: {
          [Op.lte]:  moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
        },
        end_date: {
          [Op.gte]: moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
        },
        goal_completed: false
      }
    })
    // run cron if there's data;
    if(goals.length) {
      console.log(goals.length + ' tasks running.')
      let j = goals.length;
      for(var i = 0; i < j; i++) {
        serviceHandler.handleTimeTask(goals[i])
      }
    }
  } catch (error) {
    console.log(error);
  }

}

module.exports = runTransaction;


var serviceHandler = {};

serviceHandler.handleTimeTask = ({id,last_checked, frequency_amount, amount_saved,amount_to_save,goal_title, user_id}) => {
    // check time remaining before task starts 
    const timeRemaining = moment(moment().format("YYYY-MM-DDTHH:mm:ss.000[Z]")).isAfter(last_checked);
    
    if(timeRemaining) {
      // handle update
      serviceHandler.runTask({id,user_id,goal_title,amount_to_save,calculateAmt: (parseInt(frequency_amount) + parseInt(amount_saved))})
    }
}

serviceHandler.runTask = ({id,user_id,goal_title,calculateAmt,amount_to_save}) => {
  try{
      if(parseInt(calculateAmt) >= parseInt(amount_to_save)) {
        // update goals as completed.
        GoalModel.update({goal_completed: true}, {where: {id}}).then(() => {
          Notification.create({
            user_id,  
            goal_id: id,
            message: "You've completed a goal successfully!!!",
            amount: amount_to_save,
            goal: goal_title
          })
        })
      }
      // update the last checks
      GoalModel.update({last_checked: today, amount_saved: calculateAmt}, {where: {id}}).then(() => {})
      // save transaction
      TransactionModel.create({
        user_id,
        goal_id: id,
        desc: goal_title,
        type: 'goal',
        status: 'success',
        goal: amount_to_save,
        amount: calculateAmt
      }).then(() => {})
  } catch (error) {
    throw error
  }
}
