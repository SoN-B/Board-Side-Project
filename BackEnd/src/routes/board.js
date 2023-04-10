'use strict';

const { auth } = require('../middleware/verifyJWT');

const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/board');

router.route('/')
    .get(ctrl.boardGet)
    .post(auth, ctrl.boardPost);

router.get('/new', ctrl.newView);

router.route('/:id')
    .get(ctrl.boardGetByPostId)
    .post(ctrl.boardDeleteById);

router.route('/:id/edit')
    .get(ctrl.editViewById)
    .post(auth, ctrl.boardEditById);

router.get('/:id/auth', auth, ctrl.auth);

router.route('/:id/recommand')
    .get(auth, ctrl.boardRecommandCheck)
    .post(auth, ctrl.boardRecommand);

module.exports = router;
