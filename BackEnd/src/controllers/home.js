'use strict';

/**
 * 홈화면 렌더링
 */
const homeView = (req, res) => {
    res.render('home/welcome');
};

/**
 * About 화면 렌더링
 */
const aboutView = (req, res) => {
    res.render('home/about');
};

module.exports = {
    homeView,
    aboutView,
}