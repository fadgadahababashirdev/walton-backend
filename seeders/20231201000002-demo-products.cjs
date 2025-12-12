'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Get category IDs
        const categories = await queryInterface.sequelize.query(
            `SELECT id, slug FROM "Categories";`,
            { type: Sequelize.QueryTypes.SELECT }
        );

        const wigsCategory = categories.find(c => c.slug === 'wigs');
        const soapsCategory = categories.find(c => c.slug === 'liquid-soaps');

        const products = [
            // Wigs
            {
                id: uuidv4(),
                name: 'Brazilian Straight Lace Front Wig',
                slug: 'brazilian-straight-lace-front-wig',
                description: 'Premium 100% human hair lace front wig with natural hairline. Silky straight texture, pre-plucked with baby hairs.',
                price: 15000.00,
                images: [
                    'https://res.cloudinary.com/demo/image/upload/sample-wig-1.jpg',
                    'https://res.cloudinary.com/demo/image/upload/sample-wig-1-2.jpg'
                ],
                categoryId: wigsCategory.id,
                specifications: {
                    length: '18 inches',
                    texture: 'Straight',
                    material: '100% Human Hair',
                    capConstruction: 'Lace Front',
                    color: 'Natural Black',
                    density: '150%'
                },
                isActive: true,
                isFeatured: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: 'Curly Bob Wig',
                slug: 'curly-bob-wig',
                description: 'Short curly bob wig with bouncy curls. Perfect for a chic and modern look.',
                price: 12000.00,
                images: [
                    'https://res.cloudinary.com/demo/image/upload/sample-wig-2.jpg'
                ],
                categoryId: wigsCategory.id,
                specifications: {
                    length: '12 inches',
                    texture: 'Curly',
                    material: '100% Human Hair',
                    capConstruction: 'Full Lace',
                    color: 'Dark Brown',
                    density: '130%'
                },
                isActive: true,
                isFeatured: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: 'Long Wavy Ombre Wig',
                slug: 'long-wavy-ombre-wig',
                description: 'Stunning long wavy wig with beautiful ombre coloring from dark roots to lighter ends.',
                price: 18000.00,
                images: [
                    'https://res.cloudinary.com/demo/image/upload/sample-wig-3.jpg'
                ],
                categoryId: wigsCategory.id,
                specifications: {
                    length: '24 inches',
                    texture: 'Wavy',
                    material: '100% Human Hair',
                    capConstruction: 'Lace Front',
                    color: 'Ombre (1B/30)',
                    density: '180%'
                },
                isActive: true,
                isFeatured: false,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: 'Pixie Cut Wig',
                slug: 'pixie-cut-wig',
                description: 'Stylish short pixie cut wig, easy to wear and maintain. Perfect for a bold look.',
                price: 8000.00,
                images: [
                    'https://res.cloudinary.com/demo/image/upload/sample-wig-4.jpg'
                ],
                categoryId: wigsCategory.id,
                specifications: {
                    length: '6 inches',
                    texture: 'Straight',
                    material: '100% Human Hair',
                    capConstruction: 'Machine Made',
                    color: 'Jet Black',
                    density: '120%'
                },
                isActive: true,
                isFeatured: false,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: 'Kinky Curly Full Lace Wig',
                slug: 'kinky-curly-full-lace-wig',
                description: 'Natural kinky curly texture with full lace cap for versatile styling options.',
                price: 20000.00,
                images: [
                    'https://res.cloudinary.com/demo/image/upload/sample-wig-5.jpg'
                ],
                categoryId: wigsCategory.id,
                specifications: {
                    length: '20 inches',
                    texture: 'Kinky Curly',
                    material: '100% Human Hair',
                    capConstruction: 'Full Lace',
                    color: 'Natural Black',
                    density: '150%'
                },
                isActive: true,
                isFeatured: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },

            // Liquid Soaps
            {
                id: uuidv4(),
                name: 'Lavender Moisturizing Liquid Soap',
                slug: 'lavender-moisturizing-liquid-soap',
                description: 'Gentle moisturizing liquid soap infused with natural lavender essential oil. Perfect for all skin types.',
                price: 2500.00,
                images: [
                    'https://res.cloudinary.com/demo/image/upload/sample-soap-1.jpg'
                ],
                categoryId: soapsCategory.id,
                specifications: {
                    volume: '500ml',
                    scent: 'Lavender',
                    ingredients: 'Natural oils, Glycerin, Lavender essential oil',
                    skinType: 'All skin types',
                    pH: '5.5',
                    organic: true
                },
                isActive: true,
                isFeatured: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: 'Tea Tree Antibacterial Soap',
                slug: 'tea-tree-antibacterial-soap',
                description: 'Antibacterial liquid soap with tea tree oil. Helps fight bacteria while being gentle on skin.',
                price: 3000.00,
                images: [
                    'https://res.cloudinary.com/demo/image/upload/sample-soap-2.jpg'
                ],
                categoryId: soapsCategory.id,
                specifications: {
                    volume: '500ml',
                    scent: 'Tea Tree',
                    ingredients: 'Tea tree oil, Aloe vera, Natural surfactants',
                    skinType: 'Oily and acne-prone skin',
                    pH: '5.5',
                    organic: true
                },
                isActive: true,
                isFeatured: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: 'Coconut Milk Nourishing Soap',
                slug: 'coconut-milk-nourishing-soap',
                description: 'Luxurious coconut milk liquid soap that nourishes and hydrates dry skin.',
                price: 2800.00,
                images: [
                    'https://res.cloudinary.com/demo/image/upload/sample-soap-3.jpg'
                ],
                categoryId: soapsCategory.id,
                specifications: {
                    volume: '500ml',
                    scent: 'Coconut',
                    ingredients: 'Coconut milk, Vitamin E, Shea butter',
                    skinType: 'Dry skin',
                    pH: '5.5',
                    organic: true
                },
                isActive: true,
                isFeatured: false,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: 'Citrus Fresh Hand Soap',
                slug: 'citrus-fresh-hand-soap',
                description: 'Refreshing citrus-scented hand soap with natural orange and lemon extracts.',
                price: 2200.00,
                images: [
                    'https://res.cloudinary.com/demo/image/upload/sample-soap-4.jpg'
                ],
                categoryId: soapsCategory.id,
                specifications: {
                    volume: '500ml',
                    scent: 'Citrus',
                    ingredients: 'Orange extract, Lemon extract, Natural oils',
                    skinType: 'All skin types',
                    pH: '5.5',
                    organic: true
                },
                isActive: true,
                isFeatured: false,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: 'Rose & Honey Gentle Soap',
                slug: 'rose-honey-gentle-soap',
                description: 'Gentle liquid soap with rose water and honey. Perfect for sensitive skin.',
                price: 3200.00,
                images: [
                    'https://res.cloudinary.com/demo/image/upload/sample-soap-5.jpg'
                ],
                categoryId: soapsCategory.id,
                specifications: {
                    volume: '500ml',
                    scent: 'Rose',
                    ingredients: 'Rose water, Honey, Chamomile extract',
                    skinType: 'Sensitive skin',
                    pH: '5.5',
                    organic: true
                },
                isActive: true,
                isFeatured: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuidv4(),
                name: 'Charcoal Detox Liquid Soap',
                slug: 'charcoal-detox-liquid-soap',
                description: 'Deep cleansing liquid soap with activated charcoal. Removes impurities and toxins.',
                price: 3500.00,
                images: [
                    'https://res.cloudinary.com/demo/image/upload/sample-soap-6.jpg'
                ],
                categoryId: soapsCategory.id,
                specifications: {
                    volume: '500ml',
                    scent: 'Unscented',
                    ingredients: 'Activated charcoal, Bentonite clay, Natural oils',
                    skinType: 'Oily and combination skin',
                    pH: '5.5',
                    organic: true
                },
                isActive: true,
                isFeatured: false,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        await queryInterface.bulkInsert('Products', products, {});

        // Store product IDs for inventory seeder
        global.productIds = products.map(p => p.id);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Products', null, {});
    }
};
