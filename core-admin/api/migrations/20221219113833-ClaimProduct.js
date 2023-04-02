"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */

        await queryInterface.createTable("claim_products", {
            id: {
                type: Sequelize.STRING,
                primaryKey: true,
            },
            account_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            transaction_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            product_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            plate_number: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            reporter_fullname: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            holder_fullname: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            incident_time: Sequelize.DATE,
            location: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            chronology: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            documents: {
                type: Sequelize.JSON,
            },
            status: {
                type: Sequelize.ENUM(
                    "pending",
                    "surveyed",
                    "accepted",
                    "declined",
                    "fixed",
                    "ready",
                    "done"
                ),
                defaultValue: "pending",
            },
            created_at: Sequelize.DATE,
        });
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.dropTable("claim_products");
    },
};
