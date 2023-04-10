'use strict';

const { User, Post } = require('../utils/connect');

const model = require('../utils/connect');
const user_post = model.sequelize.models.user_post;

var { createSearchQuery } = require('../functions/query');

const { Op } = require('sequelize');

const boardGet = async (req, res) => {
    let { page, limit } = req.query;
    let where_content = null,
        where_user = null;

    page = !isNaN(page) ? page : 1;
    limit = !isNaN(limit) ? limit : 10;

    let key;
    let searchQuery = await createSearchQuery(req.query);
    if (searchQuery.length > 0) key = Object.keys(searchQuery[0]);

    if (searchQuery.length === 2) {
        where_content = {
            [Op.or]: [
                { title: { [Op.like]: '%' + searchQuery[0].title + '%' } },
                { content: { [Op.like]: '%' + searchQuery[1].body + '%' } },
            ],
        };
    } else if (searchQuery.length === 1 && key[0] === 'title') {
        where_content = { title: { [Op.like]: '%' + searchQuery[0].title + '%' } };
    } else if (searchQuery.length === 1 && key[0] === 'body') {
        where_content = { content: { [Op.like]: '%' + searchQuery[0].body + '%' } };
    } else if (searchQuery.length === 1 && key[0] === 'user_name') {
        where_user = { user_name: searchQuery[0].user_name };
    }

    Post.findAndCountAll({
        include: [
            {
                model: User,
                required: true, // associated model이 존재하는 객체만을 Return
                attributes: ['user_name', 'profile'],
                where: where_user,
            },
        ],
        where: where_content,
        order: [['created_at', 'DESC']],
        limit: Math.max(1, parseInt(limit)),
        offset: (Math.max(1, parseInt(page)) - 1) * Math.max(1, parseInt(limit)),
    }).then((data) => {
        res.render('post/index', {
            posts: data.rows,
            currentPage: page,
            maxPage: Math.ceil(data.count / Math.max(1, parseInt(limit))),
            limit: limit,
            searchType: req.query.searchType,
            searchText: req.query.searchText,
        });
    })
    .catch((err) => {
        return res.status(500).json({ err });
    });
};

const boardPost = (req, res) => {
    const { title, content } = req.body;
    const user_id = req.decoded.id;

    Post.create({
        title: title,
        content: content,
        view: 0,
        user_id: user_id,
    }).then(() => {
        return res.status(200).json({ code: 200 });
    })
    .catch(() => {
        return res.status(500).json({ code: 500 });
    });
};

const newView = (req, res) => {
    res.render('post/create');
};

/**
 * post_id에 해당하는 게시글을 조회하고, 조회수를 1 증가시킨다.
 *
 * @returns {Object} 게시글 정보
 */
const boardGetByPostId = (req, res) => {
    const { id: post_id } = req.params;

    try {
        Post.findOne({ where: { id: post_id } }).then((data) => {
            Post.findOne({
                include: [
                    {
                        model: User,
                        attributes: ['user_name'],
                        where: { id: data.user_id },
                    },
                ],
                where: { id: post_id },
            }).then(async (data) => {
                await Post.increment({ view: 1 }, { where: { id: { [Op.eq]: post_id } } });
                res.render('post/read', { post: data });
            });
        })
    } catch (err) {
        return res.status(500).json({ code: 500, message: err.message });
    }
};

const boardDeleteById = (req, res) => {
    Post.destroy({ where: { id: req.params.id } })
        .then(() => {
            res.redirect('/board' + res.locals.getPostQueryString(false, { page: 1, searchText: '' }));
        })
        .catch(() => {
            return res.status(500).json({ code: 500 });
        });
};

const editViewById = (req, res) => {
    Post.findOne({ where: { id: req.params.id } }).then((data) => {
        res.render('post/update', { post: data });
    });
};

const boardEditById = (req, res) => {
    Post.update(
        {
            title: req.body.title,
            content: req.body.content,
            updated_at: new Date(),
        },
        {
            where: { id: req.body.id },
        },
    ).then(() => {
        return res.status(200).json({ code: 200 });
    })
    .catch(() => {
        return res.status(500).json({ code: 500 });
    });
};

const auth = (req, res) => {
    let userid = req.decoded.id;
    let contentid = req.params.id;

    Post.findOne({
        attributes: ['user_id'],
        where: { id: contentid },
    }).then((data) => {
        if (userid === data.user_id) {
            return res.status(200).json({ code: 200, message: 'authorized'});
        } else {
            return res.status(200).json({ code: 200, message: 'unauthorized' });
        }
    });
};

const boardRecommand = (req, res) => {
    let userid = req.decoded.id;
    let contentid = req.params.id;

    user_post.findOne({
            where: { [Op.and]: [{ user_id: userid }, { post_id: contentid }] },
        }).then((data) => {
            if (data !== null) {
                // 추천 O
                Post.findOne({
                    attributes: ['recommand'],
                    where: { id: contentid },
                }).then((data) => {
                    try {
                        Post.update({ recommand: --data.recommand }, { where: { id: contentid }, }, );

                        user_post.destroy({ where: { [Op.and]: [{ user_id: userid }, { post_id: contentid }] }, });

                        return res.status(200).json({
                            code: 200,
                            message: 'delete',
                            data: data,
                        });
                    } catch (error) {
                        return res.status(500).json({ code: 500 });
                    }
                });
            } else {
                // 추천 X
                Post.findOne({
                    attributes: ['recommand'],
                    where: { id: contentid },
                }).then((data) => {
                    try {
                        Post.update({ recommand: ++data.recommand }, { where: { id: contentid }, }, );

                        user_post.create({ user_id: userid, post_id: contentid, });

                        return res.status(200).json({
                            code: 200,
                            message: 'create',
                            data: data,
                        });
                    } catch (error) {
                        return res.status(500).json({ code: 500 });
                    }
                });
            }
        });
};

const boardRecommandCheck = (req, res) => {
    let userid = req.decoded.id;
    let contentid = req.params.id;

    user_post.findOne({
            where: { [Op.and]: [{ user_id: userid }, { post_id: contentid }] },
        }).then((data) => {
            if (data !== null) {
                // 추천 O
                return res.status(200).json({
                    code: 200,
                    message: 'created',
                });
            } else {
                // 추천 X
                return res.status(200).json({
                    code: 200,
                    message: 'deleted',
                });
            }
    });
};

module.exports = {
    boardGet,
    boardGetByPostId,
    boardPost,
    boardEditById,
    boardDeleteById,
    editViewById,
    auth,
    newView,
    boardRecommand,
    boardRecommandCheck,
};