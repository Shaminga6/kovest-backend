const express = require("express");
const { authVerify } = require("../../config/jwt");
const { getGoals, createGoal } = require("../../controller/goals.controller");

const router = express.Router();

/**
 * route to fetch goals
 * @method GET
 */
router.get("/fetch", authVerify, getGoals);

/**
 * route to create goal
 * @method POST
 */
router.post("/create", authVerify, createGoal);

module.exports = router;
