module.exports = (sequelize, Sequelize) => {
    const RoleUpgrade = sequelize.define("role_upgrades", {
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
    }, {
        freezeTableName: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: false,
    })

    RoleUpgrade.associate = function (models) {
        RoleUpgrade.belongsTo(models.Account, { foreignKey: 'subordinate_id', as: 'subordinate_upgrades' })
    }

    return RoleUpgrade
}
