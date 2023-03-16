"use strict";

const express = require('express');
const router = express.Router();

const homeRoute = require('./home');
const userRoute = require('./user');
const boardRoute = require('./board');

const { getPostQueryString } = require('../functions/util');

router.use("/", homeRoute);
router.use("/user", userRoute);
router.use("/board", getPostQueryString, boardRoute);

module.exports = router;
