const express = require("express");
const AuthRoute = require("./auth.route");
const GoalsRoute = require("./goals.route");
const UserRoute = require("./user.route");
const TransactionRoute = require("./transaction.route");

const router = express.Router();

// default routes
const defaultRoutes = [
  {
    path: "/auth",
    route: AuthRoute,
  },
  {
    path: "/goals",
    route: GoalsRoute,
  },
  {
    path: "/user",
    route: UserRoute,
  },
	{
    path: "/user",
    route: TransactionRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
