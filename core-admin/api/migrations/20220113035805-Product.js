"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("products", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            type: {
                type: Sequelize.ENUM("comprehensive", "tlo"),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            image: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            commission: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                comment: "In percent units",
            },
            extra_point: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                comment: "In percent units",
            },
            admin_fee: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            stamp_fee: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                comment: "Materai",
            },
            supported_brands: {
                type: Sequelize.STRING,
            },
            tnc: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            claim: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            brochure_file: Sequelize.STRING,
            workshop_file: Sequelize.STRING,
            workshop_count: Sequelize.INTEGER,
            extra_point: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            deleted_at: Sequelize.DATE,
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("products");
    },
};
