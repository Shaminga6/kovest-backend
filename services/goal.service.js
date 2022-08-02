// Get Dependencies

const GoalModel = require("../models/goal.model");
const TransactionModel = require("../models/transaction.model");

const runTransaction = async (frequency) => {
  try {
    const goals = await GoalModel.findAll({
      where: {
        frequency,
        savings_status: 'Active',
        is_liquidated: false,
        black_listed: false,
      }
    })
    
    // run cron if there's data;
    console.log(goals)
  } catch (error) {
    console.log(error);
  }
}

// const { getGoals } = require("../controller/goals.controller")

// const getAvailableGoals = async function(req,res,next){
//   // GET:: fetch all goals that are not blacklisted.
//   const GET_GOALS_RES = await getGoals(req,res,next);
//     try {
      
//       // check if frequency before running cronjob
//       const FREQUENCY = GET_GOALS_RES?.frequency.toLowerCase(); // 'minutes'
      
//       // Switch statements
//       switch (FREQUENCY) {
//         case "minutes":
          
//         case "daily":
        
//           break;
      
//         case "weekly":
//           break;
          
//         case "monthly":
//           // Run cron here!!
      
//           break;
//         default:
//           // NO idea tf you're talking about! 
//           break;
//       }
//     }catch(e) {
    
//     }
// }

module.exports = runTransaction;


// function cron(time,task){
//   console.log(`you have ${task.length} task to run ${time}`)
// }