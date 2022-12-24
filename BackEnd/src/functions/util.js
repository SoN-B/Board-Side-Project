'use strict';

const { User } = require('../utils/connect');

const { Op } = require('sequelize');

var util = {};

util.getPostQueryString = (req, res, next) => {
    res.locals.getPostQueryString = function(isAppended=false, overwrites={}){    
        var queryString = '';
        var queryArray = [];
        var page = overwrites.page?overwrites.page:(req.query.page?req.query.page:'');
        var limit = overwrites.limit?overwrites.limit:(req.query.limit?req.query.limit:'');
        var searchType = overwrites.searchType?overwrites.searchType:(req.query.searchType?req.query.searchType:'');
        var searchText = overwrites.searchText?overwrites.searchText:(req.query.searchText?req.query.searchText:'');

        if(page) queryArray.push('page='+page);
        if(limit) queryArray.push('limit='+limit);
        if(searchType) queryArray.push('searchType='+searchType);
        if(searchText) queryArray.push('searchText='+searchText);

        if(queryArray.length>0) queryString = (isAppended?'&':'?') + queryArray.join('&');

        return queryString;
    }
    next();
}

util.createSearchQuery = async (queries) => {
    var searchQuery = {};
    if (queries.searchType && queries.searchText && queries.searchText.length >= 3) {
        var searchTypes = queries.searchType.toLowerCase().split(",");
        var postQueries = [];

        if (searchTypes.indexOf("title") >= 0) {
            postQueries.push({ title: queries.searchText });
        } if (searchTypes.indexOf("body") >= 0) {
            postQueries.push({ body: queries.searchText });
        } if (searchTypes.indexOf("author!") >= 0) {
            // 작성자의 username이 정확히 일치하는경우
            var user = await User.findOne({ where: { username: queries.searchText } })
            if (user) postQueries.push({ username: user.username });
            else {
                postQueries.push({ username: "" });
            }
        } else if (searchTypes.indexOf("author") >= 0) {
            var user = await User.findOne({ where: { username: {[Op.like]: '%'+queries.searchText+'%'}} })
            if (user) postQueries.push({ username: user.username });
            else {
                postQueries.push({ username: "" });
            }
        }
        if (postQueries.length > 0) searchQuery = postQueries;
        else searchQuery = null;
    }
    return searchQuery;
}

module.exports = util;