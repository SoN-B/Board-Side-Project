"use strict";

const express = require('express');
const router = express.Router();

const homeRoute = require('../controllers/home/route');
const userRoute = require('../controllers/user/route');
const boardRoute = require('../controllers/board/route');

const { getPostQueryString } = require('../functions/util');

router.use("/", homeRoute);
router.use("/user", userRoute);
router.use("/board", getPostQueryString ,boardRoute);

module.exports = router;
