// Get Dependencies
const moment = require("moment");
const { Op } = require("sequelize");
const GoalModel = require("../models/goal.model");
const Notification = require("../models/notification.model");
const TransactionModel = require("../models/transaction.model");
const UserModel = require("../models/user.model");
    
    
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
            serviceHandler.handleTimeTask(goals[i], goals)
          }
        }
      } catch (error) {
        console.log(error);
      }
    
    }
    
    module.exports = runTransaction;
    
    
    var serviceHandler = {};
    
    serviceHandler.handleTimeTask = ({id,last_checked, frequency_amount, amount_saved,amount_to_save,goal_title, user_id, type_of_savings}, goals) => {
        // check time remaining before task starts 
    const timeRemaining = moment(moment().format("YYYY-MM-DDTHH:mm:ss.000[Z]")).isAfter(last_checked);
    
    if(timeRemaining) {
      // handle update
      serviceHandler.runTask({id,user_id,goal_title,amount_to_save,calculateAmt: (parseInt(frequency_amount) + parseInt(amount_saved)),type_of_savings }, goals)
    }
}

serviceHandler.runTask = ({id,user_id,goal_title,calculateAmt,amount_to_save,type_of_savings}, goals) => {
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
      
      // We should update users personal account on kovest dashboard ::- we'll be adding to the table
      if(type_of_savings.toLowerCase() === "flexible") {
        UserModel.update({flexible_savings: calculateAmt_(goals)}, {where: {user_id}}).then(() => {})
      }else if(type_of_savings.toLowerCase() === "fixed") {
        UserModel.update({fixed_savings: calculateAmt_(goals)}, {where: {user_id}}).then(() => {})
      }

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

function calculateAmt_(goals) {
  const pushAmt = [];
  let calcFullAmt;
  goals.forEach(e => {
    pushAmt.push(e.amount_saved);
    
    if(pushAmt.length) {
      calcFullAmt = pushAmt.reduce((cur,prev) => {return parseInt(cur + prev)}, []);
    }
  })
  return calcFullAmt
}