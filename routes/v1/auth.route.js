const express = require("express");
const authController = require("../../controller/auth.controller");

// define router
const router = express.Router();

/**
 * login route
 * @method POST
 */
router.post("/login", authController.login);

/**
 * sign up route
 * @method post
 */
router.post("/signup", authController.signUp);

/**
 * logout route
 * @method POST
 */
router.post("/logout", authController.logout);

module.exports = router;
