module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define(
        "roles",
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            alias: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            created_at: Sequelize.DATE,
            updated_at: Sequelize.DATE,
            deleted_at: Sequelize.DATE,
        },
        {
            freezeTableName: true,
            paranoid: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
        }
    );

    Role.associate = function (models) {
        // Role.hasMany(models.RoleEndpoint, {
        //     as: "role_endpoints",
        //     sourceKey: "id",
        //     foreignKey: "role_id",
        //     onDelete: "CASCADE",
        // });

        Role.belongsToMany(models.Endpoint, { foreignKey: 'role_id',
			through: 'role_endpoints', timestamps: false })

        Role.hasMany(models.Account, {
            as: "accounts",
            sourceKey: "id",
            foreignKey: "role_id",
        });
    };

    return Role;
};
