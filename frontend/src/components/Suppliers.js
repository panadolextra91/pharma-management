import React, {useEffect, useState} from "react";
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
import {Avatar, Button, message, Space, Table} from "antd";
import logo from '../imgs/trace.svg';
import './Suppliers.css';
import AddSupplierForm from "./AddSupplierForm"; // Import AddSupplierForm component
import EditSupplierForm from "./EditSupplierForm";
import axios from "axios"; // Import EditSupplierForm component
import PharmacistSidebar from "./PharmacistSidebar";
import AdminSidebar from "./AdminSidebar";
//Suppliers.js
const Suppliers = () => {
    //Mocking data for testing, we will use the true database later
    const [suppliers, setSuppliers] = useState([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [currentSupplier, setCurrentSupplier] = useState(null);

    useEffect(() => {
        fetchSuppliers();
    });

    const userRole = sessionStorage.getItem('userRole');

    const fetchSuppliers = async () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/suppliers', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const fetchedSuppliers = response.data.map(supplier => ({
                key: supplier.id,
                name: supplier.name,
                contact: supplier.contact_info,
                address: supplier.address
            }));
            setSuppliers(fetchedSuppliers);
        } catch (error) {
            console.error('Error fetching');
            if (error.response && error.response.status === 401) {
                message.error('Unauthorized');
            } else {
                message.error('Fail fetching suppliers');
            }
        }
    };

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
            title: 'Contact',
            dataIndex: 'contact',
            key: 'contact'
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
            { userRole === 'admin' ? <AdminSidebar/> : <PharmacistSidebar/>}

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
                    <Button className='add-button' type="primary" icon={<PlusOutlined/>} onClick={showAddSupplierModal}
                            style={{marginBottom: 16, borderRadius: 50}}>
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
