import { Inventory, Product, sequelize } from '../models/index.js';
import { Op } from 'sequelize';

export const getAllInventory = async (req, res) => {
    try {
        const inventory = await Inventory.findAll({
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'slug', 'images']
                }
            ],
            order: [['updatedAt', 'DESC']]
        });

        res.json({ inventory });
    } catch (error) {
        console.error('Get inventory error:', error);
        res.status(500).json({ error: 'Failed to fetch inventory' });
    }
};

export const getInventoryByProductId = async (req, res) => {
    try {
        const { productId } = req.params;

        const inventory = await Inventory.findOne({
            where: { productId },
            include: [
                {
                    model: Product,
                    as: 'product'
                }
            ]
        });

        if (!inventory) {
            return res.status(404).json({ error: 'Inventory not found' });
        }

        res.json({ inventory });
    } catch (error) {
        console.error('Get inventory error:', error);
        res.status(500).json({ error: 'Failed to fetch inventory' });
    }
};

export const updateInventory = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity, reorderLevel } = req.body;

        const inventory = await Inventory.findOne({ where: { productId } });
        if (!inventory) {
            return res.status(404).json({ error: 'Inventory not found' });
        }

        const updateData = {};
        if (quantity !== undefined) {
            updateData.quantity = quantity;
            updateData.lastRestocked = new Date();
        }
        if (reorderLevel !== undefined) {
            updateData.reorderLevel = reorderLevel;
        }

        await inventory.update(updateData);

        const updatedInventory = await Inventory.findOne({
            where: { productId },
            include: [{ model: Product, as: 'product' }]
        });

        res.json({
            message: 'Inventory updated successfully',
            inventory: updatedInventory
        });
    } catch (error) {
        console.error('Update inventory error:', error);
        res.status(500).json({ error: 'Failed to update inventory' });
    }
};

export const getLowStockProducts = async (req, res) => {
    try {
        const { Op } = await import('sequelize');

        const lowStock = await Inventory.findAll({
            where: {
                quantity: {
                    [Op.lte]: sequelize.col('reorderLevel')
                }
            },
            include: [
                {
                    model: Product,
                    as: 'product',
                    where: { isActive: true }
                }
            ]
        });

        res.json({ lowStock });
    } catch (error) {
        console.error('Get low stock error:', error);
        res.status(500).json({ error: 'Failed to fetch low stock products' });
    }
};
