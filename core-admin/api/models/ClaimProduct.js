module.exports = (sequelize, Sequelize) => {
    const ClaimProduct = sequelize.define(
        "claim_products",
        {
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
            surveyed_at: Sequelize.DATE,
            accepted_at: Sequelize.DATE,
            declined_at: Sequelize.DATE,
            fixed_at: Sequelize.DATE,
            ready_at: Sequelize.DATE,
            done_at: Sequelize.DATE,
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
        ClaimProduct.belongsTo(models.Transaction, {
            as: "transaction",
            sourceKey: "id",
            foreignKey: "transaction_id",
            timestamps: false,
        });
    };

    return ClaimProduct;
};
