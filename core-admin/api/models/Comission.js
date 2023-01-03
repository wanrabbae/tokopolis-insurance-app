module.exports = (sequelize, Sequelize) => {
    const Comission = sequelize.define(
        "comissions",
        {
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
        },
        {
            freezeTableName: true,
            createdAt: "created_at",
            deletedAt: false,
            updatedAt: false,
        }
    );

    Comission.associate = function (models) {
        Comission.belongsTo(models.Account, {
            as: "account",
            sourceKey: "id",
            foreignKey: "account_id",
            timestamps: false,
        });
    };

    return Comission;
};
