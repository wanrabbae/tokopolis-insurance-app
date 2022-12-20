module.exports = (sequelize, Sequelize) => {
    const ClaimProduct = sequelize.define(
        "claim_products",
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
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
            no_polis: {
                type: Sequelize.STRING,
                allowNull: true,
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
                    "surveyed",
                    "accepted",
                    "declined",
                    "fixed",
                    "ready",
                    "done"
                ),
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

    ClaimProduct.associate = function (models) {
        ClaimProduct.belongsTo(models.Account, {
            as: "account",
            sourceKey: "id",
            foreignKey: "account_id",
            timestamps: false,
        });
        ClaimProduct.belongsTo(models.Product, {
            as: "product",
            sourceKey: "id",
            foreignKey: "product_id",
            timestamps: false,
        });
    };

    return ClaimProduct;
};
