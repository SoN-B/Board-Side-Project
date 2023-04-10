'use strict';

const { User } = require('../utils/connect');
const { Op } = require('sequelize');

const { accessToken, refreshToken } = require('../functions/signJWT');
const md5 = require('md5');

exports.loginView = (req, res) => {
    res.render('user/login');
};

exports.loginPost = (req, res) => {
    let { email, password } = req.body;
    User.findOne({ where: { email: email } }).then(async (user) => {
        if (user) {
            // email로 찾았다면,
            if (md5(password) !== user.password) {
                // 비밀번호 틀림
                return res.status(405).json({
                    message: 'Incorrect password.',
                    code: 405,
                });
            } else {
                // 비밀번호 맞음
                let access_token = await accessToken({ type: 'JWT', id: user.id });
                let refresh_token = await refreshToken({ type: 'JWT', id: user.id });
                return res.status(200).json({
                    message: 'Authorize success.',
                    code: 200,
                    access_token,
                    refresh_token,
                });
            }
        } else {
            // 찾는 유저가 없을때
            return res.status(405).json({
                message: 'Unauthorized email.',
                code: 405,
            });
        }
    });
};

exports.registerView = (req, res) => {
    res.render('user/register');
};

exports.registerPost = (req, res) => {
    let { email, password, user_name } = req.body;
    User.findOne({ where: { [Op.or]: [{ email: email }, { user_name: user_name }] } }).then((data) => {
        let exist_data = JSON.stringify(data); // 객체(Object) -> JSON
        exist_data = JSON.parse(exist_data); // JSON -> 객체(Object)

        if (exist_data !== null) {
            // 찾는 데이터가 있을때
            if (exist_data.user_name === user_name) {
                return res.status(405).json({
                    message: 'Exist username.',
                    code: 405,
                });
            } else {
                return res.status(405).json({
                    message: 'Exist email.',
                    code: 405,
                });
            }
        } else {
            // 찾는 이메일, 닉네임이 없을 경우 (중복 X)
            if (user_name === '') {
                return res.status(405).json({
                    message: 'Please input username.',
                    code: 405,
                });
            } else if (email === '') {
                return res.status(405).json({
                    message: 'Please input id.',
                    code: 405,
                });
            } else if (password === '') {
                return res.status(405).json({
                    message: 'Please input password.',
                    code: 405,
                });
            } else {
                User.create({
                    user_name: user_name,
                    email: email,
                    password: md5(password),
                }).then(() => {
                    return res.status(200).json({
                        code: 200,
                    });
                })
                .catch((err) => {
                    return res.status(500).json({
                        message: err,
                        code: 500,
                    });
                });
            }
        }
    });
};

exports.profileView = (req, res) => {
    res.render('user/profile');
};

exports.profileGet = async (req, res) => {
    User.findOne({
        where: { id: req.decoded.id },
    }).then((data) => {
        return res.status(200).json({ code: 200, data: data });
    })
};

/**
 * 사용자에게, username, email을 입력받아 프로필을 편집합니다.
 *  - username, email이 다른 사용자가 사용하고 있을 시, 409 반환
 *  - username, email 변동없을 시 편집 정상 수행
 */
exports.profileEdit = async (req, res) => {
    let { user_name, email } = req.body;
    let user_id = req.decoded.id;

    const db_option = {
        user_name,
        email,
        ...(req.file && { profile: req.file.location }),
        // { profile: req.file.location } 객체가 req.file이 undefined이 아닌 경우에만 포함
    };

    if (req.file && !req.file.mimetype.startsWith('image/')) {
        // mimetype이 image 형식이 아니라면 오류 처리 로직 실행
        return res.status(400).json({
            message: 'Profile type must be only image.',
            code: 400
        });
    }

    try {
        const user = await User.findByPk(user_id);
        if(user_name === user.user_name && email === user.email && req.file === undefined) {
            return res.status(200).json({
                message: 'Profile no change.',
                code: 200,
                data: user
            });
        }

        const check_username = await User.findOne({ where: { user_name } });
        if (check_username && check_username.user_name !== user.user_name) {
            return res.status(409).json({
                message: 'The username is already in use.',
                code: 409,
            });
        }

        const check_email = await User.findOne({ where: { email } });
        if (check_email && check_email.email !== user.email) {
            return res.status(409).json({
                message: 'The email is already in use.',
                code: 409,
            });
        }

        User.update(db_option, {
            where: { id: user_id },
        }).then(() => {
            User.findOne({
                where: { id: user_id },
            }).then((data) => {
                return res.status(200).json({
                    message: 'Profile Edit Success!',
                    code: 200,
                    data: data
                });
            })
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message,
            code: 500
        });
    }
};