"use strict";

const express = require('express');
const router = express.Router();

const ctrl = require('./service');


/**
 * @swagger
 *  /:
 *    get:
 *      summary: Show home page
 *      tags: [Home]
 *      responses:
 *        "200":
 *          description: Show home page success
 */
router.get("/", ctrl.homeView);

/**
 * @swagger
 *  /about:
 *    get:
 *      summary: Show home page's about
 *      tags: [Home]
 *      responses:
 *        "200":
 *          description: Show home page's about success
 */
router.get("/about", ctrl.aboutView);

module.exports = router;
