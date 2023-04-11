'use strict';

const { auth } = require('../middleware/verifyJWT');
const { issuanceToken } = require('../functions/signJWT');

const multer = require('multer');
const upload = require("../middleware/multer");

const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/user');

// methods for user
router.post('/login', ctrl.loginPost);
router.post('/register', ctrl.registerPost);

router.get('/profile', auth, ctrl.profileGet);
router.patch('/profile', auth, (req, res) => {
    try {
        upload.single('image')(req, res, (err) => {
            if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') { // 파일 크기가 제한을 초과한 경우
                return res.status(400).json({ code: 400, message: 'File size exceeded. please check the file size and try again (not exceeding 10MB)' });
            } else if (err) { // 그 외의 에러인 경우
                return res.status(500).json({ code: 500, message: 'Server error.' });
            }
            ctrl.profileEdit(req, res); // 파일 업로드가 성공한 경우
        });
    } catch (err) {
        return res.status(500).json({ code: 500, message: err.message });
    }
});

// token refresh
router.get('/token/refresh', issuanceToken);

// rendering page
router.get('/login', ctrl.loginView);
router.get('/register', ctrl.registerView);
router.get('/profile/output/', ctrl.profileView);

module.exports = router;
