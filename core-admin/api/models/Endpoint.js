module.exports = (sequelize, Sequelize) => {
	const Endpoint = sequelize.define('endpoints', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false,
      unique: true,
		},
    route: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    method: {
      type: Sequelize.ENUM('GET', 'POST', 'PUT', 'PATCH', 'DELETE'),
      allowNull: false,
    },
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
    deleted_at: Sequelize.DATE,
	}, {
    defaultScope: {
    },
    paranoid: true,
		freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
	})

    Endpoint.associate = function (models) {
        Endpoint.belongsToMany(models.Role, { foreignKey: 'endpoint_id',
			through: 'role_endpoints', timestamps: false })
    };

	return Endpoint
}
