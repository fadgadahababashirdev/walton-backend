import express from 'express';
import {
    getAllInventory,
    getInventoryByProductId,
    updateInventory,
    getLowStockProducts
} from '../controllers/inventoryController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All inventory routes are protected
router.get('/', authenticate, getAllInventory);
router.get('/low-stock', authenticate, getLowStockProducts);
router.get('/product/:productId', authenticate, getInventoryByProductId);
router.put('/product/:productId', authenticate, updateInventory);

export default router;
