'use strict';

const Sequelize = require('sequelize');

module.exports = class Log extends Sequelize.Model {
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
                level: {
                    type: Sequelize.STRING(10),
                    allowNull: false,
                },
                method: {
                    type: Sequelize.STRING(10),
                    allowNull: false,
                },
                message: {
                    type: Sequelize.STRING(255),
                    allowNull: false,
                },
                status: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                response_time: {
                    type: Sequelize.FLOAT,
                    allowNull: false,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.NOW,
                    updated_at: false
                }
            },
            {
                sequelize,
                timestamps: false,
                paranoid: true,
                modelName: 'Log',
                tableName: 'log',
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci',
            },
        );
    }

    static associate(db) {
    }
};
