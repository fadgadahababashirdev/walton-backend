'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Get all product IDs
        const products = await queryInterface.sequelize.query(
            `SELECT id FROM "Products";`,
            { type: Sequelize.QueryTypes.SELECT }
        );

        const inventoryRecords = products.map((product, index) => {
            // Wigs typically have lower stock, soaps have higher stock
            const isWig = index < 5;
            const quantity = isWig
                ? Math.floor(Math.random() * 15) + 5  // 5-20 units for wigs
                : Math.floor(Math.random() * 50) + 20; // 20-70 units for soaps

            return {
                id: uuidv4(),
                productId: product.id,
                quantity: quantity,
                reorderLevel: isWig ? 3 : 10,
                lastRestocked: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
                createdAt: new Date(),
                updatedAt: new Date()
            };
        });

        await queryInterface.bulkInsert('Inventories', inventoryRecords, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Inventories', null, {});
    }
};
