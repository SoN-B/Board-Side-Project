"use strict"

const { Post } = require('../../utils/connect');
const { User } = require('../../utils/connect');

exports.boardGet = (req, res) => {
    Post.findAll({
        order: [['createdAt', 'DESC']]
    }).then((data) => {
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
    }).then(() => {
        return res.status(200).json({ code: 200 });
    }).catch(() => {
        return res.status(500).json({ code: 500 });
    });
}

exports.new = (req, res) => { res.render('post/new'); }

exports.boardById = (req, res) => {
    Post.findOne({ where: { id: req.params.id } })
    .then((data) => {
        Post.findOne({
            include: [{
                model: User,
                attributes: ['username'],
                where: { id: data.userkey }
            }],
            where: { id: req.params.id }
        }).then((data) => {
            res.render('post/show', {post:data});
        }).catch(() => {
            return res.status(500).json({ code: 500 });
        });
    }).catch(() => {
        return res.status(500).json({ code: 500 });
    });
}

exports.delete = (req, res) => {
    let userid = req.decoded.id;
    let contentid = req.body.id;

    Post.findOne({ 
        attributes: ['userkey'],
        where: { id: contentid }
    }).then((data) => {
        if(userid === data.userkey) {
            Post.destroy({where: { id: req.params.id }}).then(() => {
                return res.status(200).json({ code: 200 });
            }).catch(() => {
                return res.status(500).json({ code: 500 });
            });
        } else {
            return res.status(401).json({ 
                code: 401,
                message: "Unauthorized."
            });
        }
    }).catch(() => {
        return res.status(500).json({ code: 500 });
    });
}