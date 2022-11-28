module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('roles', [
            {
                id: 1,
                name: 'Superadmin',
            },
            {
                id: 2,
                name: 'Operator Manager',
            },
            {
                id: 3,
                name: 'Branch Head',
            },
            {
                id: 4,
                name: 'Supervisor',  
            },
            {
                id: 5,
                name: 'Sales',  
            }
        ], {})
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('roles', null, {})
    }
}
