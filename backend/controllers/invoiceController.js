//invoiceController.js
const { Invoice, InvoiceItem, Medicine, Customer } = require('../models'); // Ensure models are imported
const { Op } = require('sequelize');
const sequelize = require('../config/database');
// Helper function to recalculate total amount
const recalculateInvoiceTotal = async (invoice_id) => {
    const invoiceItems = await InvoiceItem.findAll({ where: { invoice_id } });
    const totalAmount = invoiceItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Update the invoice total amount
    await Invoice.update({ total_amount: totalAmount }, { where: { id: invoice_id } });
};
// Get all invoices
exports.getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.findAll({
            include: [
                {
                    model: InvoiceItem,
                    as: 'items',
                    include: [{ model: Medicine, as: 'medicine' }],
                },
                {
                    model: Customer,
                    as: 'customer', // Include customer details
                },
            ],
        });
        res.status(200).json(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ error: 'Failed to retrieve invoices', details: error.message });
    }
};

// Get a single invoice by ID
exports.getInvoiceById = async (req, res) => {
    const { id } = req.params;
    try {
        const invoice = await Invoice.findByPk(id, {
            include: {
                model: InvoiceItem,
                as: 'items',
                include: [
                    {
                        model: Medicine,
                        as: 'medicine' // Make sure the alias matches your association
                    }
                ]
            }
        });
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        res.status(200).json(invoice);
    } catch (error) {
        console.error('Error fetching invoice:', error);
        res.status(500).json({ error: 'Failed to retrieve invoice', details: error.message });
    }
};

// Create a new invoice and its items
exports.createInvoice = async (req, res) => {
    const { invoice_date, type, items, customer_id } = req.body;

    try {
        // Check if customer exists
        if (customer_id) {
            const customer = await Customer.findByPk(customer_id);
            if (!customer) {
                return res.status(404).json({ error: 'Customer not found' });
            }
        }

        // Calculate total amount
        const invoiceItems = await Promise.all(
            items.map(async (item) => {
                const medicine = await Medicine.findByPk(item.medicine_id);
                if (!medicine) {
                    throw new Error(`Medicine with ID ${item.medicine_id} not found`);
                }
                return { ...item, price: medicine.price };
            })
        );
        const totalAmount = invoiceItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Create the invoice
        const invoice = await Invoice.create({ invoice_date, type, total_amount: totalAmount, customer_id });

        // Create invoice items
        for (const item of invoiceItems) {
            await InvoiceItem.create({
                invoice_id: invoice.id,
                medicine_id: item.medicine_id,
                quantity: item.quantity,
                price: item.price,
            });
        }

        res.status(201).json(invoice);
    } catch (error) {
        console.error('Error creating invoice:', error.message);
        res.status(500).json({ error: 'Failed to create invoice', details: error.message });
    }
};

// Update an invoice and its items
exports.updateInvoice = async (req, res) => {
    const { id } = req.params;
    const { invoice_date, type, items } = req.body;

    try {
        // Find the existing invoice
        const invoice = await Invoice.findByPk(id);
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        // Update invoice details
        await invoice.update({ invoice_date, type });

        // Remove old invoice items
        await InvoiceItem.destroy({ where: { invoice_id: id } });

        // Add new invoice items
        if (items && items.length > 0) {
            for (let item of items) {
                const medicine = await Medicine.findByPk(item.medicine_id);
                if (!medicine) {
                    return res.status(404).json({ error: `Medicine with ID ${item.medicine_id} not found` });
                }
                await InvoiceItem.create({
                    invoice_id: id,
                    medicine_id: item.medicine_id,
                    quantity: item.quantity,
                    price: medicine.price
                });
            }
        }

        // Recalculate total amount
        await recalculateInvoiceTotal(id);

        res.status(200).json(invoice);
    } catch (error) {
        console.error('Error updating invoice:', error);
        res.status(500).json({ error: 'Failed to update invoice' });
    }
};

// Delete an invoice and its items
exports.deleteInvoice = async (req, res) => {
    const { id } = req.params;
    try {
        // Find the invoice
        const invoice = await Invoice.findByPk(id);
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        // Delete associated invoice items
        await InvoiceItem.destroy({ where: { invoice_id: id } });

        // Delete the invoice
        await invoice.destroy();

        res.status(204).json({ message: 'Invoice and its items deleted successfully' });
    } catch (error) {
        console.error('Error deleting invoice:', error);
        res.status(500).json({ error: 'Failed to delete invoice' });
    }
};

//get monthly rev
exports.getMonthlyRevenue = async (req, res) => {
    try {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        //fetch income from sales and outcome from purchases
        const income = await Invoice.sum('total_amount', {
            where: {
                type: 'sale',
                invoice_date: { [Op.between]: [startOfMonth, endOfMonth] },
            },
        });

        const outcome = await Invoice.sum('total_amount', {
            where: {
                type: 'purchase',
                invoice_date: { [Op.between]: [startOfMonth, endOfMonth] },
            },
        });

        res.status(200).json({
            income: income || 0,
            outcome: outcome || 0,
            total: (income || 0) - (outcome || 0),
        });
    } catch (error) {
        console.log('Error calculating monthly revenue', error);
        res.status(500).json({ error: 'Failed to calculate revenue' });
    }
};

//get sales data for month and today
/*exports.getSellingMedicines = async (req, res) => {
    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));

        // Fetch sales for the month
        const monthlySales = await InvoiceItem.findAll({
            attributes: [
                'medicine_id',
                [sequelize.fn('SUM', sequelize.col('InvoiceItem.quantity')), 'total_quantity'], // Qualify the column
            ],
            include: [{ model: Medicine, as: 'medicine', attributes: ['name'] }], // Use correct alias
            where: {
                createdAt: { [Op.between]: [startOfMonth, new Date()] },
            },
            group: ['InvoiceItem.medicine_id'], // Qualify the group by
            order: [[sequelize.fn('SUM', sequelize.col('InvoiceItem.quantity')), 'DESC']], // Qualify the column in order
        });

        // Fetch sales for today
        const dailySales = await InvoiceItem.findAll({
            attributes: [
                'medicine_id',
                [sequelize.fn('SUM', sequelize.col('InvoiceItem.quantity')), 'total_quantity'], // Qualify the column
            ],
            include: [{ model: Medicine, as: 'medicine', attributes: ['name'] }], // Use correct alias
            where: {
                createdAt: { [Op.between]: [startOfDay, new Date()] },
            },
            group: ['InvoiceItem.medicine_id'], // Qualify the group by
            order: [[sequelize.fn('SUM', sequelize.col('InvoiceItem.quantity')), 'DESC']], // Qualify the column in order
        });

        res.status(200).json({
            monthlySales,
            dailySales,
            mostPurchased: monthlySales[0] || null, // Highlight the most purchased medicine
        });
    } catch (error) {
        console.error('Error fetching selling medicines data:', error);
        res.status(500).json({ error: 'Failed to fetch selling medicines data' });
    }
};*/
