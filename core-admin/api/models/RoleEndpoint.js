module.exports = (sequelize, Sequelize) => {
  const RoleEndpoint = sequelize.define('role_endpoints', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    role_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    endpoint_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    }
  }, {
    freezeTableName: true,
    paranoid: false,
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
  })

  return RoleEndpoint
}
