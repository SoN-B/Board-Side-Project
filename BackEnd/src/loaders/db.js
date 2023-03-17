'use strict';

const Sequelize = require('sequelize');
const User = require('../models/user');
const Post = require('../models/post');

// 데이터베이스 설정을 불러옴
const config = require('config');

// new Sequelize를 통해 MySQL 연결 객체를 생성한다.
const sequelize = new Sequelize(
    config.get('mysql.database'),
    config.get('mysql.username'),
    config.get('mysql.password'),
    { host: config.get('mysql.host'), dialect: config.get('mysql.dialect') },
);

// 연결 객체를 나중에 재사용하기 위해 db.sequelize에 넣어둔다.
const db = {};

db.sequelize = sequelize;
db.User = User;
db.Post = Post;

User.init(sequelize);
Post.init(sequelize);

User.associate(db);
Post.associate(db);

module.exports = db;
