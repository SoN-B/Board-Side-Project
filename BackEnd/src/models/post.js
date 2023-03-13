"use strict";

const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {  // 테이블 필드에 대한 설정
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    allowNull: false,
                    unique: true, // 중복 X
                    primaryKey: true,
                },
                title: {
                    type: Sequelize.STRING(255),
                    allowNull: false,
                },
                content: {
                    type: Sequelize.STRING(255),
                    allowNull: false,
                },
                view: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                recommand: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: 0
                }
            },
            {  // 테이블 자체에 대한 설정
                sequelize, /* static init 메서드의 매개변수와 연결되는 옵션으로, db.sequelize 객체를 넣어야 한다. */
                timestamps: true, /* true : 각각 레코드가 생성, 수정될 때의 시간이 자동으로 입력된다. */
                paranoid: true,
                modelName: 'Post', /* 모델 이름을 설정. */
                tableName: 'postinfo', /* 데이터베이스의 테이블 이름. */
                charset: 'utf8', /* 인코딩 */
                collate: 'utf8_general_ci'
            }
        );
    }

    static associate(db) {
        db.Post.belongsTo(db.User, { foreignKey: 'userkey', targetKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
        db.Post.belongsToMany(db.User, { through: 'PostRecommand' });
    }
};