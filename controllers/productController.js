import { Product, Category, Inventory } from '../models/index.js';
import { Op } from 'sequelize';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

// Helper function to upload image to Cloudinary
const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'image'
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );

        const readableStream = Readable.from(buffer);
        readableStream.pipe(uploadStream);
    });
};

export const getAllProducts = async (req, res) => {
    try {
        const { categoryId, isActive, isFeatured, search } = req.query;
        const where = {};

        if (categoryId) where.categoryId = categoryId;
        if (isActive !== undefined) where.isActive = isActive === 'true';
        if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';
        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const products = await Product.findAll({
            where,
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug']
                },
                {
                    model: Inventory,
                    as: 'inventory',
                    attributes: ['quantity', 'reorderLevel']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({ products });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id, {
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug']
                },
                {
                    model: Inventory,
                    as: 'inventory'
                }
            ]
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ product });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, categoryId, specifications, isFeatured } = req.body;

        // Generate slug from name
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        // Upload images to Cloudinary (if configured)
        const imageUrls = [];
        if (req.files && req.files.length > 0) {
            // Check if Cloudinary is configured
            const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME &&
                process.env.CLOUDINARY_API_KEY &&
                process.env.CLOUDINARY_API_SECRET;

            if (isCloudinaryConfigured) {
                try {
                    for (const file of req.files) {
                        const result = await uploadToCloudinary(file.buffer, 'walton-products');
                        imageUrls.push(result.secure_url);
                    }
                } catch (uploadError) {
                    console.warn('Cloudinary upload failed, creating product without images:', uploadError.message);
                }
            } else {
                console.warn('Cloudinary not configured, creating product without images');
            }
        }

        // Create product
        const product = await Product.create({
            name,
            slug,
            description,
            price,
            categoryId,
            images: imageUrls,
            specifications: specifications ? JSON.parse(specifications) : {},
            isFeatured: isFeatured === 'true'
        });

        // Create inventory record
        await Inventory.create({
            productId: product.id,
            quantity: 0,
            reorderLevel: 10
        });

        const createdProduct = await Product.findByPk(product.id, {
            include: [
                { model: Category, as: 'category' },
                { model: Inventory, as: 'inventory' }
            ]
        });

        res.status(201).json({
            message: 'Product created successfully',
            product: createdProduct
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ error: 'Failed to create product', details: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, categoryId, specifications, isFeatured, isActive } = req.body;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Upload new images if provided
        let imageUrls = product.images;
        if (req.files && req.files.length > 0) {
            const newImageUrls = [];
            for (const file of req.files) {
                const result = await uploadToCloudinary(file.buffer, 'walton-products');
                newImageUrls.push(result.secure_url);
            }
            imageUrls = [...imageUrls, ...newImageUrls];
        }

        // Update product
        await product.update({
            name: name || product.name,
            slug: name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : product.slug,
            description: description !== undefined ? description : product.description,
            price: price !== undefined ? price : product.price,
            categoryId: categoryId || product.categoryId,
            images: imageUrls,
            specifications: specifications ? JSON.parse(specifications) : product.specifications,
            isFeatured: isFeatured !== undefined ? isFeatured === 'true' : product.isFeatured,
            isActive: isActive !== undefined ? isActive === 'true' : product.isActive
        });

        const updatedProduct = await Product.findByPk(id, {
            include: [
                { model: Category, as: 'category' },
                { model: Inventory, as: 'inventory' }
            ]
        });

        res.json({
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Delete associated inventory
        await Inventory.destroy({ where: { productId: id } });

        // Delete product
        await product.destroy();

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
};

export const removeProductImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { imageUrl } = req.body;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const updatedImages = product.images.filter(img => img !== imageUrl);
        await product.update({ images: updatedImages });

        res.json({
            message: 'Image removed successfully',
            product
        });
    } catch (error) {
        console.error('Remove image error:', error);
        res.status(500).json({ error: 'Failed to remove image' });
    }
};
