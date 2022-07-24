"use strict";

exports.home = (req, res) => {
    res.render('home/welcome');
}
exports.about = (req, res) => {
    res.render('home/about');
}