'use strict';

const jwt = require('jsonwebtoken');

const config = require('config');

const ACCESS_SECRET_KEY = config.get('JWT.access_secret_key');
const REFRESH_SECRET_KEY = config.get('JWT.refresh_secret_key');

const accessToken = (payload) => {
    return jwt.sign(payload, ACCESS_SECRET_KEY, {
        expiresIn: '15m',
        issuer: config.get('JWT.issuer'),
    });
};

const refreshToken = (payload) => {
    return jwt.sign(payload, REFRESH_SECRET_KEY, {
        expiresIn: '1h',
        issuer: config.get('JWT.issuer'),
    });
};

const issuanceToken = (req, res) => {
    return jwt.verify(req.headers.authorization, REFRESH_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(419).json({
                code: 419,
                message: 'Refresh token is invalid. Please login again.',
            });
        }

        const access_token = accessToken({ type: decoded.type, id: decoded.id });
        return res.status(200).json({
            message: 'Access token refresh success.',
            access_token: access_token,
        });
    });
};

module.exports = {
    accessToken, refreshToken, issuanceToken
};
