import React, { useState } from "react";
import {
    HomeOutlined,
    MedicineBoxOutlined,
    AppstoreOutlined,
    TeamOutlined,
    ShoppingCartOutlined,
    FileTextOutlined,
    BarChartOutlined,
    UserOutlined,
    LoginOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { Avatar, Button, Space, Table } from "antd";
import logo from '../imgs/trace.svg';
import './SalesInvoices.css';
import AddInvoice from "./AddInvoice";
import EditInvoice from "./EditInvoice";
//SalesInvoices.js
const SalesInvoices = () => {
    // State for managing invoices with mocking data
    const [invoices, setInvoices] = useState([
        {
            key: '1',
            customerName: 'John Doe',
            status: 'Paid',
            items: [
                { key: '1', name: 'Paracetamol', quantity: 2, price: 10 },
                { key: '2', name: 'Ibuprofen', quantity: 1, price: 15 }
            ],
            totalAmount: 35
        },
        {
            key: '2',
            customerName: 'Jane Smith',
            status: 'Pending',
            items: [
                { key: '1', name: 'Amoxicillin', quantity: 3, price: 12 },
                { key: '2', name: 'Vitamin C', quantity: 2, price: 5 }
            ],
            totalAmount: 46
        }
    ]);

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState(null);

    // Show the Add Invoice Modal
    const showAddInvoiceModal = () => {
        setIsAddModalVisible(true);
    };

    // Show the Edit Invoice Modal
    const showEditInvoiceModal = (invoice) => {
        setEditingInvoice(invoice);
        setIsEditModalVisible(true);
    };

    // Handle the addition of a new invoice
    const handleAddInvoice = (newInvoice) => {
        setInvoices([...invoices, { key: invoices.length + 1, ...newInvoice }]);
        setIsAddModalVisible(false);
    };

    // Handle the editing of an existing invoice
    const handleEditInvoice = (updatedInvoice) => {
        const updatedInvoices = invoices.map((invoice) =>
            invoice.key === updatedInvoice.key ? updatedInvoice : invoice
        );
        setInvoices(updatedInvoices);
        setIsEditModalVisible(false);
        setEditingInvoice(null);
    };

    // Handle the deletion of an invoice
    const deleteInvoice = (key) => {
        const updatedInvoices = invoices.filter((invoice) => invoice.key !== key);
        setInvoices(updatedInvoices);
    };

    // Cancel modal
    const handleCancel = () => {
        setIsAddModalVisible(false);
        setIsEditModalVisible(false);
        setEditingInvoice(null);
    };

    const columns = [
        {
            title: 'Customer Name',
            dataIndex: 'customerName',
            key: 'customerName'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (text) => `$${text}`
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        style={{ borderRadius: 50 }}
                        onClick={() => showEditInvoiceModal(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        style={{ borderRadius: 50 }}
                        danger
                        onClick={() => deleteInvoice(record.key)}
                    >
                        Delete
                    </Button>
                </Space>
            )
        }
    ];

    return (
        <div className="sales-container">
            {/* Sidebar Navigation */}
            <aside className="sidebar">
                <div className="border">
                    <img src={logo} alt="MediMaster" className="logo-image" />
                    <h2>
                        Medi<br />
                        Master
                    </h2>
                </div>
                <div className="menu">
                    <nav className="nav">
                        <ul>
                            <li>
                                <a href="/dashboard">
                                    <HomeOutlined /> Dashboard
                                </a>
                            </li>
                            <li>
                                <a href="/medicines">
                                    <MedicineBoxOutlined /> Medicines
                                </a>
                            </li>
                            <li>
                                <a href="/categories">
                                    <AppstoreOutlined /> Categories
                                </a>
                            </li>
                            <li>
                                <a href="/suppliers">
                                    <TeamOutlined /> Suppliers
                                </a>
                            </li>
                            <li>
                                <a href="/sales-invoices">
                                    <FileTextOutlined /> Sales & Invoices
                                </a>
                            </li>
                            <li>
                                <a href="/reports">
                                    <BarChartOutlined /> Reports
                                </a>
                            </li>
                            <li>
                                <a href="/profile">
                                    <UserOutlined /> User Profile
                                </a>
                            </li>
                            <li>
                                <a href="/">
                                    <LoginOutlined /> Logout
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="header">
                    <div className="header-left">
                        <h1>Sales & Invoices Management</h1>
                        <p>Dashboard / Sales & Invoices</p>
                    </div>
                    <div className="header-right">
                        <Avatar size={50} icon={<UserOutlined />} />
                    </div>
                </header>
                <section className="sales-table">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={showAddInvoiceModal}
                        className='add-button'
                    >
                        Add Invoice
                    </Button>
                    <Table columns={columns} dataSource={invoices} />
                </section>
                <AddInvoice
                    visible={isAddModalVisible}
                    onCreate={handleAddInvoice}
                    onCancel={handleCancel}
                />
                <EditInvoice
                    visible={isEditModalVisible}
                    onEdit={handleEditInvoice}
                    onCancel={handleCancel}
                    invoice={editingInvoice}
                />
            </main>
        </div>
    );
};

export default SalesInvoices;
