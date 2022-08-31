"use strict";

const { auth } = require('../../middleware/verifyJWT');
const signJWT = require('../../functions/signJWT');
const express = require('express');
const router = express.Router();

const ctrl = require('./service');

/**
 * @swagger
 * paths:
 *  /user/login:
 *   post:
 *    summary: 로그인 post 요청
 *    tags: [User]
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *       properties:
 *        email:
 *         type: string
 *         description: 사용자 ID (email type)
 *        password:
 *         type: string
 *         description: 사용자 PW
 *    responses:
 *     200:
 *      description: Authorize success.
 *      schema:
 *       properties:
 *        message:
 *         type: string
 *        code:
 *         type: integer
 *         default: 200
 *        access_token:
 *         type: string
 *        refresh_token:
 *         type: string
 *     405:
 *      description: Incorrect password. & Unauthorized email.
 *      schema:
 *       properties:
 *        message:
 *         type: string
 *        code:
 *         type: integer
 *         default: 405
 */
router.route("/login")
    .get(ctrl.loginView)
    .post(ctrl.loginPost)

router.route("/register")
    .get(ctrl.registerView)
    .post(ctrl.registerPost)

router.get("/profile", auth, ctrl.profileGet);
router.get("/profile/output/", ctrl.profileView)
router.get("/token/refresh", signJWT.issuance);

module.exports = router;
