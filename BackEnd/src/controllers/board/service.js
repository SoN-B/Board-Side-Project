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
}

exports.boardDelete_id = (req, res) => {
    // let userid = req.decoded.id;
    // let contentid = req.body.id;

    // Post.findOne({ 
    //     attributes: ['userkey'],
    //     where: { id: contentid }
    // }).then((data) => {
    //     if(userid === data.userkey) {
    //         Post.destroy({where: { id: req.params.id }}).then(() => {
    //             return res.status(200).json({ code: 200 });
    //         }).catch(() => {
    //             return res.status(500).json({ code: 500 });
    //         });
    //     } else {
    //         return res.status(401).json({ 
    //             code: 401,
    //             message: "Unauthorized."
    //         });
    //     }
    // }).catch(() => {
    //     return res.status(500).json({ code: 500 });
    // });

    Post.destroy({where: { id: req.params.id }})
    .then(() => {
        console.log(req.params.id);

        Post.findAll({
            order: [['createdAt', 'DESC']]
        }).then((data) => {
            res.render('post/index', {posts: data});
        }).catch((err) => {
            return res.status(500).json({
                err
            });
        });  
    })
    .catch(() => {
        return res.status(500).json({ code: 500 });
    });
}

exports.editView_id = (req, res) => { 
    // let userid = req.decoded.id;
    // let contentid = req.params.id;

    // Post.findOne({ 
    //     attributes: ['userkey'],
    //     where: { id: contentid }
    // }).then((data) => {
    //     if(userid === data.userkey) {
    //         Post.findOne({ where: { id: contentid }})
    //             .then((data) => {
    //                 return res.status(200).json({ 
    //                     code: 200,
    //                     data: data
    //                 });
    //             })
    //             .catch(() => {
    //                 return res.status(500).json({ code: 500 });
    //             });
    //     } else {
    //         return res.status(401).json({ 
    //             code: 401,
    //             message: "Unauthorized."
    //         });
    //     }
    // }).catch(() => {
    //     return res.status(500).json({ code: 500 });
    // });


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