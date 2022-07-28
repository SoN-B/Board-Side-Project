"use strict"

const { Post } = require('../../utils/connect');
const { User } = require('../../utils/connect');

exports.boardGet = (req, res) => {
    Post.findAll({
        order: [['createdAt', 'DESC']]
    }).then((data) => {

        console.log(data);
        res.render('post/index', {posts: data});
    }).catch((err) => {
        return res.status(500).json({
            err
        });
    });
}

exports.boardPost = (req, res) => {
    let { title, content } = req.body;
    let userkey = req.decoded.id;

    Post.create({
        title: title,
        content: content,
        hit: 0,
        view: 0,
        userkey: userkey
    }).then((data) => {
        return res.status(200).json({
            data
        });
    }).catch((err) => {
        return res.status(500).json({
            err
        });
    });
}