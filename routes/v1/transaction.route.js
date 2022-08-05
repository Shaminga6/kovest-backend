const express = require("express");
const { authVerify } = require("../../config/jwt");
const { getTransactions } = require("../../controller/transaction.controller");

const router = express.Router();

/**
 * route to transaction goals
 * @method GET
 */
router.get("/transaction", authVerify, getTransactions);

module.exports = router;
