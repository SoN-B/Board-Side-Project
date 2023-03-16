"use strict";

const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/home');

router.get("/", ctrl.homeView);
router.get("/about", ctrl.aboutView);

module.exports = router;
