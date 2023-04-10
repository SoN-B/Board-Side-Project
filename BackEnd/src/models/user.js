'use strict';

const config = require('config');

const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    allowNull: false,
                    unique: true,
                    primaryKey: true,
                },
                profile: {
                    type: Sequelize.STRING(100),
                    allowNull: true,
                    defaultValue: config.get('default.profile')
                },
                user_name: {
                    type: Sequelize.STRING(30),
                    unique: true,
                    allowNull: false,
                },
                email: {
                    type: Sequelize.STRING(30),
                    unique: true,
                    allowNull: false,
                },
                password: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                modelName: 'User',
                tableName: 'user_info',
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    static associate(db) {
        db.User.hasMany(db.Post, { foreignKey: 'user_id', sourceKey: 'id', onDelete: 'cascade', onUpdate: 'cascade' });
        db.User.belongsToMany(db.Post, { through: 'user_post', foreignKey: 'user_id', otherKey: 'post_id' });
    }
};
