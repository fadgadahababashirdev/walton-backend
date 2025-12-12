'use strict';

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const users = [
            {
                id: uuidv4(),
                email: 'admin@walton.com',
                password: hashedPassword,
                name: 'Walton Admin',
                role: 'admin',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                email: 'manager@walton.com',
                password: hashedPassword,
                name: 'Walton Manager',
                role: 'manager',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        await queryInterface.bulkInsert('Users', users, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Users', null, {});
    }
};
