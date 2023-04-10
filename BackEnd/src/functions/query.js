'use strict';

const { User } = require('../utils/connect');

const { Op } = require('sequelize');

exports.getPostQueryString = (req, res, next) => {
    res.locals.getPostQueryString = function (isAppended = false, overwrites = {}) {
        let queryString = '';
        let queryArray = [];
        let page = overwrites.page ? overwrites.page : req.query.page ? req.query.page : '';
        let limit = overwrites.limit ? overwrites.limit : req.query.limit ? req.query.limit : '';
        let searchType = overwrites.searchType ? overwrites.searchType : req.query.searchType ? req.query.searchType : '';
        let searchText = overwrites.searchText ? overwrites.searchText : req.query.searchText ? req.query.searchText : '';

        if (page) queryArray.push('page=' + page);
        if (limit) queryArray.push('limit=' + limit);
        if (searchType) queryArray.push('searchType=' + searchType);
        if (searchText) queryArray.push('searchText=' + searchText);

        if (queryArray.length > 0) queryString = (isAppended ? '&' : '?') + queryArray.join('&');

        return queryString;
    };
    next();
};

exports.createSearchQuery = async (queries) => {
    let searchQuery = {}, user;

    if (queries.searchType && queries.searchText && queries.searchText.length >= 3) {
        let searchTypes = queries.searchType.toLowerCase().split(',');
        let postQueries = [];

        if (searchTypes.indexOf('title') >= 0) {
            postQueries.push({ title: queries.searchText });
        }
        if (searchTypes.indexOf('body') >= 0) {
            postQueries.push({ body: queries.searchText });
        }
        if (searchTypes.indexOf('author!') >= 0) {
            // 작성자의 username이 정확히 일치하는 경우
            user = await User.findOne({ where: { username: queries.searchText } });
            if (user) postQueries.push({ username: user.username });
            else {
                postQueries.push({ username: '' });
            }
        } else if (searchTypes.indexOf('author') >= 0) {
            user = await User.findOne({ where: { username: { [Op.like]: '%' + queries.searchText + '%' } } });
            if (user) postQueries.push({ username: user.username });
            else {
                postQueries.push({ username: '' });
            }
        }
        if (postQueries.length > 0) searchQuery = postQueries;
        else searchQuery = null;
    }
    return searchQuery;
};
