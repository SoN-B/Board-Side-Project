"use strict";

const { User } = require('../../utils/connect');
const { Op }=require('sequelize');

const signJWT = require('../../functions/signJWT');
const md5 = require('md5');

const path = require('path');

exports.loginView = (req, res) => { res.render("user/login"); }

exports.loginPost = (req, res) => {
    let { email, password } = req.body;
    User.findOne({ where: { email: email }}).then( async (user) => {
        if ( user ) { // email로 찾았다면,
            if ( md5(password) !== user.password ) { // 비밀번호 틀림
                return res.status(405).json({
                    message: "Incorrect password.",
                    code: 405
                });
            }
            else { // 비밀번호 맞음
                let access_token = await signJWT.access({ type: 'JWT', id: user.id });
                let refresh_token = await signJWT.refresh({ type: 'JWT', id: user.id });
                return res.status(200).json({
                    message: "Authorize success.",
                    code: 200,
                    access_token,
                    refresh_token,
                });
            }
        }
        else { // 찾는 유저가 없을때
            return res.status(405).json({
                message: "Unauthorized email.",
                code: 405
            });
        }
    });
}

exports.registerView = (req, res) => { res.render("user/register"); }

exports.registerPost = (req, res) => {
    let { email, password, username } = req.body;
    User.findOne({ where: { [Op.or]: [{ email: email }, { username: username }] }})
    .then(( data ) => {
        let exist_data = JSON.stringify(data); // 객체(Object) -> JSON
        exist_data = JSON.parse(exist_data); // JSON -> 객체(Object)

        if ( exist_data !== null ) { // 찾는 데이터가 있을때
            if ( exist_data.username === username ) {
                return res.status(405).json({
                    message: "Exist username.",
                    code: 405
                });
            }
            else {
                return res.status(405).json({
                    message: "Exist email.",
                    code: 405
                });
            }
        }
        else { // 찾는 이메일, 닉네임이 없을 경우 (중복 X)
            if ( username === "" ) {
                return res.status(405).json({
                    message: "Please input username.",
                    code: 405
                });
            }
            else if ( email === "" ) {
                return res.status(405).json({
                    message: "Please input id.",
                    code: 405
                });
            }
            else if (password === "") {
                return res.status(405).json({
                    message: "Please input password.",
                    code: 405
                });
            }
            else {
                User.create({
                    username: username,
                    email: email,
                    password: md5(password),
                }).then(() => {
                    return res.status(200).json({
                        code: 200
                    });
                }).catch((err) => {
                    return res.status(500).json({
                        message: err,
                        code: 500
                    });
                });
            }
        }
    });
}

exports.profileView = (req, res) => {
    res.sendFile(path.join(__dirname, '../../../../FrontEnd/views/user/profile.html'));
}

exports.profileGet = async (req, res) => {
    const userinfo = await User.findOne({
        where: { id: req.decoded.id }
    })

    return res.status(200).json({
        message: "User auth success.",
        code: 200,
        data: userinfo
    });
}