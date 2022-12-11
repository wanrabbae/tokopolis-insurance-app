module.exports = (sequelize, Sequelize) => {
    const Account = sequelize.define(
        "accounts",
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            fullname: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            firstname: {
                type: Sequelize.VIRTUAL,
                get() {
                    if (this.fullname == null) {
                        return null;
                    }

                    if (this.fullname.indexOf(" ") >= 0) {
                        return this.fullname.split(" ")[0];
                    }

                    return this.fullname;
                },
            },
            lastname: {
                type: Sequelize.VIRTUAL,
                get() {
                    if (
                        this.fullname != null &&
                        this.fullname.indexOf(" ") >= 0
                    ) {
                        return this.fullname.split(" ")[1];
                    }

                    return null;
                },
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            role: {
                type: Sequelize.ENUM("client", "agent", "admin"),
                defaultValue: "client",
            },
            role_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
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
        },
        {
            scopes: {
                withoutPass: {
                    attributes: { exclude: ["password"] },
                },
            },
            paranoid: true,
            freezeTableName: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
        }
    );

    Account.associate = function (models) {
        Account.hasOne(models.Profile, {
            as: "profile",
            sourceKey: "id",
            foreignKey: "account_id",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });

        Account.hasOne(models.Identity, {
            as: "identity",
            sourceKey: "id",
            foreignKey: "account_id",
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });

        Account.hasMany(models.AccountToken, {
            as: "tokens",
            sourceKey: "id",
            foreignKey: "account_id",
            onDelete: "CASCADE",
        });

        Account.hasMany(models.Transaction, {
            as: "client_transactions",
            sourceKey: "id",
            foreignKey: "client_id",
            onDelete: "CASCADE",
        });

        Account.hasMany(models.Transaction, {
            as: "agent_transactions",
            sourceKey: "id",
            foreignKey: "agent_id",
            onDelete: "CASCADE",
        });

        Account.belongsToMany(models.Vehicle, {
            foreignKey: "account_id",
            through: "account_vehicles",
            timestamps: false,
        });

        Account.belongsTo(models.Role, {
            as: "roles",
            sourceKey: "id",
            foreignKey: "role_id",
        });
    };

    return Account;
};
