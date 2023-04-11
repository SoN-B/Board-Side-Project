'use strict';

const { auth } = require('../middleware/verifyJWT');
const { issuanceToken } = require('../functions/signJWT');

const upload = require("../middleware/multer");

const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/user');

// methods for user
router.post('/login', ctrl.loginPost);
router.post('/register', ctrl.registerPost);

router.get('/profile', auth, ctrl.profileGet);
router.patch('/profile', auth, upload.single("image"), ctrl.profileEdit);

// token refresh
router.get('/token/refresh', issuanceToken);

// rendering page
router.get('/login', ctrl.loginView);
router.get('/register', ctrl.registerView);
router.get('/profile/output/', ctrl.profileView);

module.exports = router;
