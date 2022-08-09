const express = require("express");
const { authVerify } = require("../../config/jwt");
const { addCard, getUser } = require("../../controller/user.controller");

const router = express.Router();

/**
 * route to fetch goals
 * @method PUT
 */
router.put("/card", authVerify, addCard);

/**
 * route to fetch user
 * @method GET
 */
 router.get("/me", authVerify, getUser);

module.exports = router;
