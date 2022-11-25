'use strict';

util.getPostQueryString = function(req, res, next){
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

module.exports = util;