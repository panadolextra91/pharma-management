import React, { useState, useEffect } from "react";
import {
    HomeOutlined,
    MedicineBoxOutlined,
    AppstoreOutlined,
    TeamOutlined,
    FileTextOutlined,
    UserOutlined,
    LoginOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { Avatar, Button, Space, Table, message } from "antd";
import axios from "axios";
import logo from '../imgs/trace.svg';
import './SalesInvoices.css';
import AddInvoice from "./AddInvoice";
import EditInvoice from "./EditInvoice";
import AdminSidebar from "./AdminSidebar";
import PharmacistSidebar from "./PharmacistSidebar";
import {useNavigate} from "react-router-dom";
const SalesInvoices = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState(null);

    // Fetch invoices from the backend
    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleAvaterClick = () => {
        navigate('/profile');
    }

    const userRole = sessionStorage.getItem('userRole');

    const fetchInvoices = async () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/invoices', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const fetchedInvoices = response.data.map((invoice) => ({
                ...invoice,
                key: invoice.id,
                customerName: invoice.customer?.name || 'N/A', // Map customer name
                totalAmount: Number(invoice.total_amount),
                items: invoice.items.map((item) => ({
                    ...item,
                    name: item.medicine.name,
                })),
            }));
            setInvoices(fetchedInvoices);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            message.error('Failed to fetch invoices');
        }
    };




    // Show the Add Invoice Modal
    const showAddInvoiceModal = () => {
        setIsAddModalVisible(true);
    };

    // Show the Edit Invoice Modal
    const showEditInvoiceModal = (invoice) => {
        setEditingInvoice(invoice);
        setIsEditModalVisible(true);
    };

    // Handle the deletion of an invoice
    const deleteInvoice = async (key) => {
        try {
            await axios.delete(`http://localhost:3000/api/invoices/${key}`);
            message.success('Invoice deleted successfully');
            fetchInvoices(); // Refresh the list
        } catch (error) {
            console.error('Error deleting invoice:', error);
            message.error('Failed to delete invoice');
        }
    };

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
            title: 'Type',
            dataIndex: 'type',
            key: 'type'
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (text) => `$${text.toFixed(2)}`
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
            { userRole === 'admin' ? <AdminSidebar/> : <PharmacistSidebar/>}

            <main className="main-content">
                <header className="header">
                    <div className="header-left">
                        <h1>Sales & Invoices Management</h1>
                        <p>Dashboard / Sales & Invoices</p>
                    </div>
                    <div className="header-right">
                        <div onClick={handleAvaterClick} style={{cursor: 'pointer'}}>
                            <Avatar size={50} icon={<UserOutlined/>}/>
                        </div>
                    </div>
                </header>
                <section className="sales-table">
                    <Button
                        type="primary"
                        icon={<PlusOutlined/>}
                        onClick={showAddInvoiceModal}
                        className='add-button'
                    >
                        Add Invoice
                    </Button>
                    <Table columns={columns} dataSource={invoices}/>
                </section>
                <AddInvoice
                    visible={isAddModalVisible}
                    onCreate={(newInvoice) => {
                        setIsAddModalVisible(false);
                        fetchInvoices(); // Refresh the list
                    }}
                    onCancel={handleCancel}
                />
                <EditInvoice
                    visible={isEditModalVisible}
                    onEdit={(updatedInvoice) => {
                        setIsEditModalVisible(false);
                        fetchInvoices(); // Refresh the list
                    }}
                    onCancel={handleCancel}
                    invoice={editingInvoice}
                />
            </main>
        </div>
    );
};

export default SalesInvoices;
