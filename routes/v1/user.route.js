const express = require("express");
const { authVerify } = require("../../config/jwt");
const { addCard } = require("../../controller/user.controller");

const router = express.Router();

/**
 * route to fetch goals
 * @method PUT
 */
router.put("/card", authVerify, addCard);

module.exports = router;
