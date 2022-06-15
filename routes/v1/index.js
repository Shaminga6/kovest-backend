const express = require('express');
const AuthRoute = require('./auth.route');

const router = express.Router();

// default routes
const defaultRoutes = [
  {
    path: '/auth',
    route: AuthRoute,
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
