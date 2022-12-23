module.exports = (sequelize, Sequelize) => {
    const Notification = sequelize.define(
        "notifications",
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            message: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            link: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            is_seen: {
                type: Sequelize.BOOLEAN,
                defaultValue: 0,
                allowNull: false,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            sender_user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            type: {
                type: Sequelize.STRING,
                allowNull: true,
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

    Notification.associate = function (models) {
        Notification.belongsTo(models.Account, {
            as: "account",
            sourceKey: "id",
            foreignKey: "sender_user_id",
            timestamps: false,
        });
    };

    return Notification;
};
