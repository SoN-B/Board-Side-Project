"use strict";

const express = require('express');
const router = express.Router();

const homeRoute = require('../controllers/home/route');
const userRoute = require('../controllers/user/route');
const boardRoute = require('../controllers/board/route');

router.use("/", homeRoute);
router.use("/user", userRoute);
router.use("/board", boardRoute);

module.exports = router;
