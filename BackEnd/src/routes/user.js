"use strict";

const { auth } = require('../middleware/verifyJWT');
const signJWT = require('../functions/signJWT');

const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/user');

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