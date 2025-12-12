import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

const Inventory = sequelize.define('Inventory', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: {
            model: 'Products',
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    reorderLevel: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
        validate: {
            min: 0
        }
    },
    lastRestocked: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true
});

export default Inventory;
