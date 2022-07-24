"use strict";

const express = require('express');
const router = express.Router();

const ctrl = require('./service');

router.get("/", ctrl.home);
router.get("/about", ctrl.about);

module.exports = router;
