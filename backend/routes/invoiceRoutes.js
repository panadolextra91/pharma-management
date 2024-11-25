const express = require('express');
const invoiceController = require('../controllers/invoiceController');
const authenticateToken = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizeMiddleware');
const router = express.Router();
const InvoiceItem = require('../models/InvoiceItem');
const Medicine = require('../models/Medicines');
//invoiceRoutes.js
// Routes for invoices
router.get('/', authenticateToken, authorize('admin', 'pharmacist'), invoiceController.getAllInvoices);
router.get('/:id', authenticateToken, authorize('admin', 'pharmacist'), invoiceController.getInvoiceById);
router.post('/', authenticateToken, authorize('admin', 'pharmacist'), invoiceController.createInvoice);
router.put('/:id', authenticateToken, authorize('admin', 'pharmacist'), invoiceController.updateInvoice);
router.delete('/:id', authenticateToken, authorize('admin', 'pharmacist'), invoiceController.deleteInvoice);

router.get('/sales', authenticateToken, authorize('admin', 'pharmacist'), async (req, res) => {
    try {
        const sales = await Invoice.findAll({
            where: { type: 'sale' },
            include: {
                model: InvoiceItem,
                as: 'items',
                include: [Medicine]
            }
        });
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve sales' });
    }
});


module.exports = router;
