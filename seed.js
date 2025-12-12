import { sequelize } from './config/database.cjs';
import { User, Category, Product, Inventory } from './models/index.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // 1. Seed Admin Users
        console.log('👤 Creating admin users...');

        const [admin, manager] = await Promise.all([
            User.findOrCreate({
                where: { email: 'admin@walton.com' },
                defaults: {
                    id: uuidv4(),
                    email: 'admin@walton.com',
                    password: 'admin123',  // Plain text - will be hashed by User model hook
                    name: 'Walton Admin',
                    role: 'admin',
                    isActive: true
                }
            }),
            User.findOrCreate({
                where: { email: 'manager@walton.com' },
                defaults: {
                    id: uuidv4(),
                    email: 'manager@walton.com',
                    password: 'admin123',  // Plain text - will be hashed by User model hook
                    name: 'Walton Manager',
                    role: 'manager',
                    isActive: true
                }
            })
        ]);
        console.log('✅ Admin users created\n');

        // 2. Seed Categories
        console.log('📁 Creating categories...');
        const [wigsCategory] = await Category.findOrCreate({
            where: { slug: 'wigs' },
            defaults: {
                id: uuidv4(),
                name: 'Wigs',
                slug: 'wigs',
                description: 'Premium quality wigs in various styles, colors, and lengths',
                isActive: true
            }
        });

        const [soapsCategory] = await Category.findOrCreate({
            where: { slug: 'liquid-soaps' },
            defaults: {
                id: uuidv4(),
                name: 'Liquid Soaps',
                slug: 'liquid-soaps',
                description: 'Natural and organic liquid soaps for all skin types',
                isActive: true
            }
        });
        console.log('✅ Categories created\n');

        // 3. Seed Products
        console.log('📦 Creating products...');

        // Wigs
        const wigProducts = [
            {
                name: 'Brazilian Straight Lace Front Wig',
                slug: 'brazilian-straight-lace-front-wig',
                description: 'Premium 100% human hair lace front wig with natural hairline. Silky straight texture, pre-plucked with baby hairs.',
                price: 15000.00,
                images: ['https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500'],
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
                stock: 12
            },
            {
                name: 'Curly Bob Wig',
                slug: 'curly-bob-wig',
                description: 'Short curly bob wig with bouncy curls. Perfect for a chic and modern look.',
                price: 12000.00,
                images: ['https://images.unsplash.com/photo-1560869713-7d0a29430803?w=500'],
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
                stock: 8
            },
            {
                name: 'Long Wavy Ombre Wig',
                slug: 'long-wavy-ombre-wig',
                description: 'Stunning long wavy wig with beautiful ombre coloring from dark roots to lighter ends.',
                price: 18000.00,
                images: ['https://images.unsplash.com/photo-1595475884562-073c30d45670?w=500'],
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
                stock: 15
            },
            {
                name: 'Pixie Cut Wig',
                slug: 'pixie-cut-wig',
                description: 'Stylish short pixie cut wig, easy to wear and maintain. Perfect for a bold look.',
                price: 8000.00,
                images: ['https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=500'],
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
                stock: 20
            },
            {
                name: 'Kinky Curly Full Lace Wig',
                slug: 'kinky-curly-full-lace-wig',
                description: 'Natural kinky curly texture with full lace cap for versatile styling options.',
                price: 20000.00,
                images: ['https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500'],
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
                stock: 10
            }
        ];

        // Liquid Soaps
        const soapProducts = [
            {
                name: 'Lavender Moisturizing Liquid Soap',
                slug: 'lavender-moisturizing-liquid-soap',
                description: 'Gentle moisturizing liquid soap infused with natural lavender essential oil. Perfect for all skin types.',
                price: 2500.00,
                images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500'],
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
                stock: 45
            },
            {
                name: 'Tea Tree Antibacterial Soap',
                slug: 'tea-tree-antibacterial-soap',
                description: 'Antibacterial liquid soap with tea tree oil. Helps fight bacteria while being gentle on skin.',
                price: 3000.00,
                images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500'],
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
                stock: 38
            },
            {
                name: 'Coconut Milk Nourishing Soap',
                slug: 'coconut-milk-nourishing-soap',
                description: 'Luxurious coconut milk liquid soap that nourishes and hydrates dry skin.',
                price: 2800.00,
                images: ['https://images.unsplash.com/photo-1617897903246-719242758050?w=500'],
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
                stock: 52
            },
            {
                name: 'Citrus Fresh Hand Soap',
                slug: 'citrus-fresh-hand-soap',
                description: 'Refreshing citrus-scented hand soap with natural orange and lemon extracts.',
                price: 2200.00,
                images: ['https://images.unsplash.com/photo-1585155770960-a6eb1cb2c0c7?w=500'],
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
                stock: 60
            },
            {
                name: 'Rose & Honey Gentle Soap',
                slug: 'rose-honey-gentle-soap',
                description: 'Gentle liquid soap with rose water and honey. Perfect for sensitive skin.',
                price: 3200.00,
                images: ['https://images.unsplash.com/photo-1600857544200-242c8e1c3e8f?w=500'],
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
                stock: 42
            },
            {
                name: 'Charcoal Detox Liquid Soap',
                slug: 'charcoal-detox-liquid-soap',
                description: 'Deep cleansing liquid soap with activated charcoal. Removes impurities and toxins.',
                price: 3500.00,
                images: ['https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500'],
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
                stock: 35
            }
        ];

        const allProducts = [...wigProducts, ...soapProducts];

        for (const productData of allProducts) {
            const stock = productData.stock;
            delete productData.stock;

            const [product, created] = await Product.findOrCreate({
                where: { slug: productData.slug },
                defaults: {
                    id: uuidv4(),
                    ...productData
                }
            });

            if (created) {
                // Create inventory for the product
                await Inventory.create({
                    id: uuidv4(),
                    productId: product.id,
                    quantity: stock,
                    reorderLevel: stock < 20 ? 3 : 10,
                    lastRestocked: new Date()
                });
            }
        }

        console.log('✅ Products and inventory created\n');

        // Summary
        const counts = await Promise.all([
            User.count(),
            Category.count(),
            Product.count(),
            Inventory.count()
        ]);

        console.log('📊 Database Seeding Summary:');
        console.log(`   Users: ${counts[0]}`);
        console.log(`   Categories: ${counts[1]}`);
        console.log(`   Products: ${counts[2]}`);
        console.log(`   Inventory Records: ${counts[3]}`);
        console.log('\n✅ Database seeding completed successfully!');
        console.log('\n🔑 Login Credentials:');
        console.log('   Admin: admin@walton.com / admin123');
        console.log('   Manager: manager@walton.com / admin123');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    } finally {
        await sequelize.close();
    }
};

seedDatabase();
