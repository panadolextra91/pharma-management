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
import './Suppliers.css';
import AddSupplierForm from "./AddSupplierForm"; // Import AddSupplierForm component
import EditSupplierForm from "./EditSupplierForm"; // Import EditSupplierForm component
//Suppliers.js
const Suppliers = () => {
    //Mocking data for testing, we will use the true database later
    const [suppliers, setSuppliers] = useState([
        {
            key: '1',
            name: 'Supplier A',
            phone: '123-456-7890',
            address: '123 Main St, City A'
        },
        {
            key: '2',
            name: 'Supplier B',
            phone: '098-765-4321',
            address: '456 Elm St, City B'
        }
    ]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [currentSupplier, setCurrentSupplier] = useState(null);

    const showAddSupplierModal = () => {
        setIsAddModalVisible(true);
    };

    const showEditSupplierModal = (key) => {
        const supplierToEdit = suppliers.find(supplier => supplier.key === key);
        setCurrentSupplier(supplierToEdit);
        setIsEditModalVisible(true);
    };

    const handleAddSupplier = (values) => {
        const newSupplier = {
            key: suppliers.length + 1,
            ...values,
        };
        setSuppliers([...suppliers, newSupplier]);
        setIsAddModalVisible(false);
    };

    const handleEditSupplier = (values) => {
        const updatedSuppliers = suppliers.map(supplier =>
            supplier.key === currentSupplier.key ? { ...supplier, ...values } : supplier
        );
        setSuppliers(updatedSuppliers);
        setIsEditModalVisible(false);
    };

    const handleCancelAdd = () => {
        setIsAddModalVisible(false);
    };

    const handleCancelEdit = () => {
        setIsEditModalVisible(false);
    };

    const deleteSupplier = (key) => {
        const updatedSuppliers = suppliers.filter(supplier => supplier.key !== key);
        setSuppliers(updatedSuppliers);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone'
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address'
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} style={{ borderRadius: 50 }} onClick={() => showEditSupplierModal(record.key)}>Edit</Button>
                    <Button icon={<DeleteOutlined />} style={{ borderRadius: 50 }} danger onClick={() => deleteSupplier(record.key)}>Delete</Button>
                </Space>
            )
        }
    ];

    return (
        <div className="suppliers-container">
            {/* Sidebar Navigation */}
            <aside className="sidebar">
                <div className="border">
                    <img src={logo} alt='MediMaster' className='logo-image'/>
                    <h2>Medi<br/>Master</h2>
                </div>
                <div>
                    <nav>
                        <ul>
                            <li>
                                <a href="/dashboard">
                                    <HomeOutlined/> Dashboard
                                </a>
                            </li>
                            <li>
                                <a href="/medicines">
                                    <MedicineBoxOutlined/> Medicines
                                </a>
                            </li>
                            <li>
                                <a href="/categories">
                                    <AppstoreOutlined/> Categories
                                </a>
                            </li>
                            <li>
                                <a href="/suppliers">
                                    <TeamOutlined/> Suppliers
                                </a>
                            </li>
                            <li>
                                <a href="/sales-invoices">
                                    <FileTextOutlined/> Sales & Invoices
                                </a>
                            </li>
                            <li>
                                <a href="/reports">
                                    <BarChartOutlined/> Reports
                                </a>
                            </li>
                            <li>
                                <a href="/profile">
                                    <UserOutlined/> User Profile
                                </a>
                            </li>
                            <li>
                                <a href='/'>
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
                    <div className='header-left'>
                        <h1>Suppliers Management</h1>
                        <p>Dashboard / Suppliers</p>
                    </div>
                    <div className='header-right'>
                        <Avatar size={50} icon={<UserOutlined/>}/>
                    </div>
                </header>
                <section className="suppliers-table">
                    <Button className='add-button' type="primary" icon={<PlusOutlined/>} onClick={showAddSupplierModal} style={{ marginBottom: 16, borderRadius: 50 }}>
                        Add Supplier
                    </Button>
                    <Table columns={columns} dataSource={suppliers}/>
                </section>
                <AddSupplierForm
                    visible={isAddModalVisible}
                    onCreate={handleAddSupplier}
                    onCancel={handleCancelAdd}
                />
                <EditSupplierForm
                    visible={isEditModalVisible}
                    onEdit={handleEditSupplier}
                    onCancel={handleCancelEdit}
                    supplier={currentSupplier}
                />
            </main>
        </div>
    )
}

export default Suppliers;
