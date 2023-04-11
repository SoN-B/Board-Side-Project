'use strict';

const { auth } = require('../middleware/verifyJWT');

const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/board');

// methods for board
router.get('/', ctrl.boardGet)
router.post('/', auth, ctrl.boardPost);

router.get('/:id', ctrl.boardGetByPostId);
router.delete('/:id', ctrl.boardDeleteByPostId);
router.patch('/:id', auth, ctrl.boardEditByPostId);

router.post('/:id/recommand', auth, ctrl.boardRecommand)

// check auth, recommand status
router.get('/:id/auth', auth, ctrl.postAuthCheck);
router.get('/:id/recommand', auth, ctrl.boardRecommandCheck);

// rendering page
router.get('/post/new', ctrl.postView);
router.get('/:id/edit', ctrl.editViewByPostId);

module.exports = router;
