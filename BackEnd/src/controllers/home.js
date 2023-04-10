'use strict';

exports.homeView = (req, res) => {
    res.render('home/welcome');
};

exports.aboutView = (req, res) => {
    res.render('home/about');
};
