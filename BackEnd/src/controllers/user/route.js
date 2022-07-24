"use strict";

const { auth } = require('../../middleware/verifyJWT');
const express = require('express');
const router = express.Router();

const ctrl = require('./service');

router.route("/login")
    .get(ctrl.loginOutput)
    .post(ctrl.login)

router.route("/register")
    .get(ctrl.registerOutput)
    .post(ctrl.register)

router.get("/profile", auth, ctrl.profile);
router.get("/profile/output/", ctrl.profileOutput)

module.exports = router;
