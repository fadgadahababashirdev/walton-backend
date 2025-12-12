'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const categories = [
            {
                id: uuidv4(),
                name: 'Wigs',
                slug: 'wigs',
                description: 'Premium quality wigs in various styles, colors, and lengths',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: 'Liquid Soaps',
                slug: 'liquid-soaps',
                description: 'Natural and organic liquid soaps for all skin types',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        await queryInterface.bulkInsert('Categories', categories, {});

        // Store category IDs for use in product seeder
        global.categoryIds = {
            wigs: categories[0].id,
            liquidSoaps: categories[1].id
        };
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Categories', null, {});
    }
};
