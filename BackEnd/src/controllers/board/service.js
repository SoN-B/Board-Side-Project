"use strict"

const { Post } = require('../../utils/connect');
const { User } = require('../../utils/connect');

const model = require('../../utils/connect');
const PostRecommand = model.sequelize.models.PostRecommand;

var { createSearchQuery } = require("../../functions/util");

const { Op } = require('sequelize');

exports.boardGet = async (req, res) => {
    let { page, limit } = req.query;
    let where_content = null, where_user = null;

    page = !isNaN(page)?page:1;
    limit = !isNaN(limit)?limit:10;

    let key;
    let searchQuery = await createSearchQuery(req.query);
    if(searchQuery.length > 0) key = Object.keys(searchQuery[0]);

    if ( searchQuery.length === 2 ) {
        where_content = {
            [Op.or]: [
                { title: {[Op.like]: '%'+searchQuery[0].title+'%'}},
                { content: {[Op.like]: '%'+searchQuery[1].body+'%'}}
            ]
        };
    } else if ( searchQuery.length === 1 && key[0] === 'title') {
        where_content = { title: {[Op.like]: '%'+searchQuery[0].title+'%'}};
    }  else if ( searchQuery.length === 1 && key[0] === 'body') {
        where_content = { content: {[Op.like]: '%'+searchQuery[0].body+'%'}};
    } else if ( searchQuery.length === 1 && key[0] === 'username') {
        where_user = { username: searchQuery[0].username };
    }

    Post.findAndCountAll({
        include: [{
            model: User,
            required: true, // associated model이 존재하는 객체만을 Return
            attributes: ['username'],
            where: where_user
        }],
        where: where_content,
        order: [['createdAt', 'DESC']],
        limit: Math.max(1, parseInt(limit)),
        offset: (Math.max(1, parseInt(page)) - 1) * Math.max(1, parseInt(limit))
    }).then((data) => {
        res.render('post/index', {
            posts: data.rows,
            currentPage: page,
            maxPage: Math.ceil(data.count / Math.max(1, parseInt(limit))),
            limit: limit,
            searchType: req.query.searchType,
            searchText: req.query.searchText,
        });
    }).catch((err) => {
        return res.status(500).json({ err });
    });
}

exports.boardPost = (req, res) => {
    let { title, content } = req.body;
    let userkey = req.decoded.id;

    Post.create({
        title: title,
        content: content,
        view: 0,
        userkey: userkey
    }).then(() => {
        return res.status(200).json({ code: 200 });
    }).catch(() => {
        return res.status(500).json({ code: 500 });
    });
}

exports.newView = (req, res) => { res.render('post/new'); }

exports.boardView_id = (req, res) => {
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

    Post.increment({ view: 1 }, { where: {id: {[ Op.eq ]: req.params.id }}});
}

exports.boardDelete_id = (req, res) => {
    Post.destroy({where: { id: req.params.id }})
    .then(() => {
        res.redirect("/board" + res.locals.getPostQueryString(false, { page: 1, searchText: "" }));
    })
    .catch(() => {
        return res.status(500).json({ code: 500 });
    });
}

exports.editView_id = (req, res) => { 
    Post.findOne({ where: { id: req.params.id }})
        .then((data) => {
            res.render('post/edit', {post:data});
        })
}

exports.boardEdit_id = (req, res) => {
    Post.update({
        title: req.body.title,
        content: req.body.content
    }, {
        where: { id: req.body.id },
    }).then(() => {
        return res.status(200).json({ code: 200 });
    }).catch(() => {
        return res.status(500).json({ code: 500 });
    });
}

exports.auth = (req, res) => {
    let userid = req.decoded.id;
    let contentid = req.params.id;

    Post.findOne({ 
        attributes: ['userkey'],
        where: { id: contentid }
    })
    .then((data) => {
        if(userid === data.userkey) {
            return res.status(200).json({ code: 200 });
        } else {
            return res.status(500).json({ code: 500 });
        }
    });
}

exports.boardRecommand = (req, res) => {
    let userid = req.decoded.id;
    let contentid = req.params.id;

    PostRecommand.findOne({
        where: {[Op.and]: [
            { UserId: userid },
            { PostId: contentid },
        ]}
    }).then((data) => {
        if(data !== null) { // 추천 O
            Post.findOne({ 
                attributes: ['recommand'],
                where: { id: contentid }
            }).then((data) => {
                try {
                    Post.update({ recommand: --data.recommand, }, {
                        where: { id: contentid },
                    })
        
                    PostRecommand.destroy({
                        where: {[Op.and]: [
                            { UserId: userid },
                            { PostId: contentid },
                        ]}
                    })
        
                    return res.status(200).json({ 
                        code: 200,
                        message: "delete"
                    });
                } catch(error) {
                    return res.status(500).json({ code: 500 });
                }
            });
        } else { // 추천 X
            Post.findOne({ 
                attributes: ['recommand'],
                where: { id: contentid }
            }).then((data) => {
                try {
                    Post.update({ recommand: ++data.recommand, }, {
                        where: { id: contentid },
                    })
        
                    PostRecommand.create({
                        UserId: userid,
                        PostId: contentid,
                    })
        
                    return res.status(200).json({ 
                        code: 200,
                        message: "create"
                    });
                } catch(error) {
                    return res.status(500).json({ code: 500 });
                }
            });
        }
    })
}

exports.boardRecommandCheck = (req, res) => {
    let userid = req.decoded.id;
    let contentid = req.params.id;

    PostRecommand.findOne({
        where: {[Op.and]: [
            { UserId: userid },
            { PostId: contentid },
        ]}
    }).then((data) => {
        if(data !== null) { // 추천 O
            return res.status(200).json({ 
                code: 200,
                message: "created"
            });
        } else { // 추천 X
            return res.status(200).json({ 
                code: 200,
                message: "deleted"
            });
        }
    })
}