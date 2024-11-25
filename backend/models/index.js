const Invoice = require('./Invoice');
const InvoiceItem = require('./InvoiceItem');
const Medicine = require('./Medicines');
//index.js
// Define associations here after all models are loaded
Invoice.hasMany(InvoiceItem, {
    foreignKey: 'invoice_id',
    as: 'items',
    onDelete: 'CASCADE'
});

InvoiceItem.belongsTo(Invoice, {
    foreignKey: 'invoice_id',
    as: 'invoice',
    onDelete: 'CASCADE'
});

InvoiceItem.belongsTo(Medicine, {
    foreignKey: 'medicine_id',
    as: 'medicine',
    onDelete: 'CASCADE'
});

module.exports = {
    Invoice,
    InvoiceItem,
    Medicine
};
