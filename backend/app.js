require('dotenv').config();
const db = require('./config/database');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const User = require('./models/User'); // Import the User model
const userRoutes = require('./routes/userRoutes');
const Medicine = require('./models/Medicines.js');
const medicineRoutes = require('./routes/medicineRoutes')
const Supplier = require('./models/Supplier');
const supplierRoutes = require('./routes/supplierRoutes');
const Category = require('./models/Category');
const categoryRoutes = require('./routes/categoryRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
require('./models');
const invoiceItemRoutes = require('./routes/invoiceItemRoutes');
const locationRoutes = require('./routes/locationRoutes');
const Location = require('./models/Location');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const customerRoutes = require('./routes/customerRoutes');

// Serve static files from the 'uploads' directory
//app.js
// Middleware
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test Database Connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connected...');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

// Sync all models with the database
sequelize.sync({ alter: true }) // Sync all defined models with the database
    .then(() => {
        console.log('All models were synchronized successfully.');
    })
    .catch((err) => {
        console.error('Error syncing models:', err);
    });

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Pharmacy Management System API');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

//Integrate apis
app.use('/api/users', userRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/invoice-items', invoiceItemRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/customers', customerRoutes);
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.use(express.json()); // To parse JSON requests
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded requests
