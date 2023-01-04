"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */

        await queryInterface.createTable("comissions", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            account_id: {
				type: Sequelize.INTEGER,
				primaryKey: true
			},
            transaction_id: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: true,
            },
            value: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            description: {
                type: Sequelize.STRING,
                allowNull: true,
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

        await queryInterface.dropTable("comissions");
    },
};
