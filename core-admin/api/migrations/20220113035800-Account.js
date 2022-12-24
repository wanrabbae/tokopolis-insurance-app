"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("accounts", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            fullname: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            role_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            parent_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            unique_id: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            other_id: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            email_verified_at: Sequelize.DATE,
            created_at: Sequelize.DATE,
            updated_at: Sequelize.DATE,
            deleted_at: Sequelize.DATE,
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("accounts");
    },
};
