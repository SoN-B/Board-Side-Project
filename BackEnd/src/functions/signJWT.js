'use strict';

const jwt = require('jsonwebtoken');
const config = require('config');
const ACCESS_SECRET_KEY = config.get('JWT.access_secret_key');
const REFRESH_SECRET_KEY = config.get('JWT.refresh_secret_key');

const signJWT = {
    access(payload) {
        return jwt.sign(payload, ACCESS_SECRET_KEY, {
            expiresIn: '1h',
            issuer: config.get('JWT.issuer'),
        });
    },
    refresh(payload) {
        return jwt.sign(payload, REFRESH_SECRET_KEY, {
            expiresIn: '180d',
            issuer: config.get('JWT.issuer'),
        });
    },
    issuance: (req, res) => {
        const access = (payload) => {
            return jwt.sign(payload, ACCESS_SECRET_KEY, {
                expiresIn: '1h',
                issuer: config.get('JWT.issuer'),
            });
        };

        return jwt.verify(req.headers.authorization, REFRESH_SECRET_KEY, (err, decoded) => {
            if (err) res.sendStatus(403);
            const access_token = access({
                type: decoded.type,
                id: decoded.id,
            });
            return res.status(200).json({
                message: 'token refresh success.',
                access_token: access_token,
            });
        });
    },
};

module.exports = signJWT;
