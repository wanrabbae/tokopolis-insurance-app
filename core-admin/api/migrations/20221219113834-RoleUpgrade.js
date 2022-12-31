"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("role_upgrades", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            leader_id: {
                type: Sequelize.INTEGER,
                primaryKey: true
            },
            subordinate_id: {
                type: Sequelize.INTEGER,
                primaryKey: true
            },
            status: {
                type: Sequelize.ENUM('waiting', 'approved', 'denied'),
                defaultValue: 'waiting'
            },
            created_at: Sequelize.DATE,
            updated_at: Sequelize.DATE,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("role_upgrades");
    },
};
