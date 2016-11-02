var express = require('express');
var auth = require('../../config/auth');

var apiRouter  = express.Router();

var usersRouter = require('./users');

apiRouter.use('/users',usersRouter);

module.exports = apiRouter;