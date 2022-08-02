// Get Dependencies

const { getGoals } = require("../controller/goals.controller")

const getAvailableGoals = async function(req,res,next){

    try {
      // GET:: fetch all goals that are not blacklisted.
      const GET_GOALS_RES = await getGoals(req,res,next);
    }catch(e) {
    
    }
}