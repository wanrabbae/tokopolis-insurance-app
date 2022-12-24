"use strict";

module.exports = {
<<<<<<< HEAD
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
=======
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('products', {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			type: {
				type: Sequelize.ENUM('comprehensive', 'tlo'),
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
>>>>>>> master
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
