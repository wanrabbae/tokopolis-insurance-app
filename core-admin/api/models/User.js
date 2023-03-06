module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('users', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            autoIncrement: true,
        },
        dealer_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        role_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
    }, {
        freezeTableName: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })

    User.associate = function (models) {
        User.belongsTo(models.Dealer, {
            as: "dealer",
            sourceKey: "id",
            foreignKey: "dealer_id",
        });
        User.belongsTo(models.Role, {
            as: "role",
            sourceKey: "id",
            foreignKey: "role_id",
        });
    }

    return User
}