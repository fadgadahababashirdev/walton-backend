import { Category, Product } from '../models/index.js';

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            where: { isActive: true },
            include: [
                {
                    model: Product,
                    as: 'products',
                    attributes: ['id'],
                    where: { isActive: true },
                    required: false
                }
            ]
        });

        const categoriesWithCount = categories.map(cat => ({
            ...cat.toJSON(),
            productCount: cat.products.length
        }));

        res.json({ categories: categoriesWithCount });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id, {
            include: [
                {
                    model: Product,
                    as: 'products',
                    where: { isActive: true },
                    required: false
                }
            ]
        });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json({ category });
    } catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({ error: 'Failed to fetch category' });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        const category = await Category.create({
            name,
            slug,
            description
        });

        res.status(201).json({
            message: 'Category created successfully',
            category
        });
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({ error: 'Failed to create category' });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, isActive } = req.body;

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        await category.update({
            name: name || category.name,
            slug: name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : category.slug,
            description: description !== undefined ? description : category.description,
            isActive: isActive !== undefined ? isActive : category.isActive
        });

        res.json({
            message: 'Category updated successfully',
            category
        });
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Check if category has products
        const productCount = await Product.count({ where: { categoryId: id } });
        if (productCount > 0) {
            return res.status(400).json({
                error: 'Cannot delete category with existing products'
            });
        }

        await category.destroy();

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
};
