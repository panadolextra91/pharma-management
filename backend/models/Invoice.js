const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
//Invoice.js
const Invoice = sequelize.define('Invoice', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    invoice_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('sale', 'purchase'),
        allowNull: false,
    },
}, {
    tableName: 'invoices',
    timestamps: false,
});

module.exports = Invoice;
