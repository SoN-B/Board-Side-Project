'use strict';

const { auth } = require('../middleware/verifyJWT');
const { issuanceToken } = require('../functions/signJWT');

const upload = require("../middleware/multer");

const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/user');

router.route('/login')
    .get(ctrl.loginView)
    .post(ctrl.loginPost);

router.route('/register')
    .get(ctrl.registerView)
    .post(ctrl.registerPost);

router.route('/profile')
    .get(auth, ctrl.profileGet)
    .put(auth, upload.single("image"), ctrl.profileEdit);

router.get('/profile/output/', ctrl.profileView);
router.get('/token/refresh', issuanceToken);

module.exports = router;
