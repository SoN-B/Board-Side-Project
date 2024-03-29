'use strict';

const { User } = require('../utils/connect');

const { Op } = require('sequelize');

/**
 * 쿼리스트링 생성 함수 (페이지네이션, 검색) (isAppended: 기존 쿼리스트링에 추가할지 여부) (overwrites: 기존 쿼리스트링 대신 사용할 값)
 */
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

/**
 * 검색 쿼리 생성 함수 (검색어가 없는 경우 null 반환)
 */
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
            // 작성자의 user_name이 정확히 일치하는 경우
            user = await User.findOne({ where: { user_name: queries.searchText } });
            if (user) postQueries.push({ user_name: user.user_name });
            else {
                postQueries.push({ user_name: '' });
            }
        } else if (searchTypes.indexOf('author') >= 0) {
            user = await User.findOne({ where: { user_name: { [Op.like]: '%' + queries.searchText + '%' } } });
            if (user) postQueries.push({ user_name: user.user_name });
            else {
                postQueries.push({ user_name: '' });
            }
        }
        if (postQueries.length > 0) searchQuery = postQueries;
        else searchQuery = null;
    }
    return searchQuery;
};
