const express = require("express");
const { authVerify } = require("../../config/jwt");
const { getTransactions, liquidate } = require("../../controller/transaction.controller");

const router = express.Router();

/**
 * route to transaction goals
 * @method GET
 */
router.get("/transaction", authVerify, getTransactions);


/**
 * route to liquidate your cash
 * @method POST
 */
router.post("/withdraw", authVerify, liquidate)

module.exports = router;
