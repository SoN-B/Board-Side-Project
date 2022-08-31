"use strict";

const express = require('express');
const router = express.Router();

const ctrl = require('./service');


/**
 * @swagger
 * paths:
 *  /:
 *    get:
 *      summary: Show home page
 *      tags: [Home]
 */
router.get("/", ctrl.homeView);

/**
 * @swagger
 * paths:
 *  /about:
 *    get:
 *      summary: Show home page's about
 *      tags: [Home]
 */
router.get("/about", ctrl.aboutView);

module.exports = router;
