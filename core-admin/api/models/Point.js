module.exports = (sequelize, Sequelize) => {
    const Point = sequelize.define(
        "points",
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

    Point.associate = function (models) {
        Point.belongsTo(models.Account, {
            as: "account",
            sourceKey: "id",
            foreignKey: "account_id",
            timestamps: false,
        });
    };

    return Point;
};
