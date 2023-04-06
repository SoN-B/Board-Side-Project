'use strict';

const jwt = require('jsonwebtoken');
const config = require('config');
const ACCESS_SECRET_KEY = config.get('JWT.access_secret_key');

exports.auth = (req, res, next) => {
    // 인증 완료
    try {
        // 요청 헤더에 저장된 토큰(req.headers.authorization)과 비밀키를 사용하여 토큰을 req.decoded에 반환
        req.decoded = jwt.verify(req.headers.authorization, ACCESS_SECRET_KEY);
        return next();
    } catch (error) {
        // 인증 실패
        // 유효시간이 초과된 경우
        if (error.name === 'TokenExpiredError') {
            return res.status(419).json({
                code: 419,
                message: 'Access token has expired.',
            });
        }
        // 토큰의 비밀키가 일치하지 않는 경우
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                code: 401,
                message: 'Access token is invalid.',
            });
        }
    }
};
