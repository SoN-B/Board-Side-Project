"use strict";

const express = require('express');
const router = express.Router();

const homeRoute = require('../controllers/home/route');
const userRoute = require('../controllers/user/route');

router.use("/", homeRoute);
router.use("/user", userRoute);

module.exports = router;
