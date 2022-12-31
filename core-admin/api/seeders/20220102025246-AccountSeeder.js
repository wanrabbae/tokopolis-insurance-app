const bcrypt = require('bcrypt')

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash('@dmin123', salt)

        return queryInterface.bulkInsert('accounts', [{
            fullname: 'Administrator',
            email: 'admin@tokopolis.id',
            password: hashedPassword,
            role_id: 1,
        }], {})
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('accounts', null, {})
    }
}
