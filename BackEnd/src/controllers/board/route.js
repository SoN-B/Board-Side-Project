"use strict";

const { auth } = require('../../middleware/verifyJWT');
const express = require('express');
const router = express.Router();

const ctrl = require('./service');

router.route("/")
    .get(ctrl.boardGet)
    .post(auth, ctrl.boardPost)

router.get("/new", ctrl.new)

module.exports = router;
