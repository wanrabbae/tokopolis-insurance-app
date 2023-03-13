module.exports = (sequelize, Sequelize) => {
    const MenuList = sequelize.define("menu_lists", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        label: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        selected_role: {
            type: Sequelize.JSON,
            allowNull: true,
        },
        created_at: Sequelize.DATE,
    }, {
        freezeTableName: true,
        createdAt: "created_at",
        deletedAt: false,
        updatedAt: false,
    });
    return MenuList;
};