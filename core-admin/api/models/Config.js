module.exports = (sequelize, Sequelize) => {
    const Config = sequelize.define('config', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        key: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        value: {
            type: Sequelize.STRING,
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

    return Config
}
