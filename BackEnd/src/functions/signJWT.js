"use strict";

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
    issuance(refresh_token, res) {
        return jwt.verify(
            refresh_token,
            REFRESH_SECRET_KEY,
            (err, decoded) => {
                if (err) res.sendStatus(403);
                const access_token = this.access({
                    type: decoded.type,
                    id: decoded.id,
                });
                return access_token;
            }
        );
    }
}

module.exports = signJWT;