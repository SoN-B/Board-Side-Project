"use strict";

const { User } = require('../../utils/connect');
const sign_jwt = require('../../functions/signJWT');
const md5 = require('md5');
const path = require('path');

exports.loginOutput = (req, res) => {
    res.render('user/login');
}

exports.login = async (req, res) => {
    try {
        const user_info = await User.findOne({ // id로 해당 유저정보 가져옴
            attributes: ['email', 'password'],
            where: { email: req.body.email }
        });
        
        if(user_info.email === req.body.email && user_info.password === md5(req.body.password)) {
            let access_token = sign_jwt.access({ type: 'JWT', email: user_info.email });
            let refresh_token = sign_jwt.refresh({ type: 'JWT', email: user_info.email });
            
            return res.status(200).json({
                code: 200,
                message: "Token is created.",
                access_token: access_token,
                refresh_token: refresh_token
            });
        }
        else if(user_info.password !== md5(req.body.password)) { // 비밀번호 틀림
            return res.status(401).json({
                code: 401,
                message: "Incorrect password."
            });
        }
    } catch (error) {
        if(error.message === "Cannot read properties of null (reading 'email')") { // 아이디 틀림
            return res.status(401).json({
                code: 401,
                message: "Incorrect id."
            });
        }
        return res.status(500).json({ // 서버 오류
            code: 500,
            message: error.message
        });
    }
}

exports.registerOutput = (req, res) => {
    res.render('user/register');
}

exports.register = async (req, res) => {
    if(req.body.username && req.body.email && req.body.password) {
        const [user, created] = await User.findOrCreate({
            where: { email: req.body.email },
            defaults: {
                username: req.body.username,
                email: req.body.email,
                password: md5(req.body.password),
            }
        });
        if (created) res.render('user/login'); // 찾지못해서 생성함
        else {
            return res.status(401).json({
                code: 401,
                message: "email already exist.",
            });
        }
    }
    else {
        return res.status(401).json({
            code: 401,
            message: "input is void.",
        });
    }
}

exports.profile = async (req, res) => {
    const userinfo = await User.findOne({
        where: { email: req.decoded.email }
    })

    return res.status(200).json({
        code: 200,
        message: "user auth success.",
        data: userinfo
    });
}

exports.profileOutput = (req, res) => {
    res.sendFile(path.join(__dirname, '../../../../FrontEnd/views/user/profile.html'));
}