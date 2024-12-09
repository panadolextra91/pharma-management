import React, { useState, useEffect } from "react";
import {
    HomeOutlined,
    MedicineBoxOutlined,
    AppstoreOutlined,
    TeamOutlined,
    FileTextOutlined,
    BarChartOutlined,
    UserOutlined,
    LoginOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { Avatar, Button, Space, Table, Tag, Tooltip, message } from "antd";
import axios from "axios";
import logo from '../imgs/trace.svg';
import './Medicines.css';
import AddMedicineForm from "./AddMedicineForm";
import EditMedicineForm from "./EditMedicineForm";
import AdminSidebar from "./AdminSidebar";
import PharmacistSidebar from "./PharmacistSidebar";

const Medicines = () => {
    const LOW_STOCK_THRESHOLD = 20;
    const [medicines, setMedicines] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [locations, setLocations] = useState([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingMedicine, setEditingMedicine] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMedicines();
        fetchCategories();
        fetchSuppliers();
        fetchLocations();
    }, []);

    const role = sessionStorage.getItem('userRole');

    const fetchMedicines = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/medicines', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMedicines(response.data);
        } catch (error) {
            message.error("Failed to fetch medicines data.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const token = sessionStorage.getItem('token'); // Ensure token is retrieved
            const response = await axios.get('http://localhost:3000/api/categories', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(response.data);
        } catch (error) {
            message.error("Failed to fetch categories.");
        }
    };

    const fetchSuppliers = async () => {
        try {
            const token = sessionStorage.getItem('token'); // Ensure token is retrieved
            const response = await axios.get('http://localhost:3000/api/suppliers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuppliers(response.data);
        } catch (error) {
            message.error("Failed to fetch suppliers.");
        }
    };

    const fetchLocations = async () => {
        try {
            const token = sessionStorage.getItem('token'); // Ensure token is retrieved
            const response = await axios.get('http://localhost:3000/api/locations', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLocations(response.data);
        } catch (error) {
            message.error("Failed to fetch locations.");
        }
    };


    const showAddMedicineModal = () => {
        setIsAddModalVisible(true);
    };

    const showEditMedicineModal = (medicine) => {
        setEditingMedicine(medicine);
        setIsEditModalVisible(true);
    };

    const handleAddMedicine = async (values) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post('http://localhost:3000/api/medicines', values, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMedicines([...medicines, response.data]); // Add new medicine to state
            message.success("Medicine added successfully.");
            setIsAddModalVisible(false);
        } catch (error) {
            message.error("Failed to add medicine.");
        }
    };

    const handleEditMedicine = (updatedMedicine) => {
        const updatedMedicines = medicines.map((medicine) =>
            medicine.id === updatedMedicine.id ? updatedMedicine : medicine
        );
        setMedicines(updatedMedicines);
        setIsEditModalVisible(false);
    };

    const handleCancel = () => {
        setIsAddModalVisible(false);
        setIsEditModalVisible(false);
    };

    const deleteMedicine = async (id) => {
        try {
            const token = sessionStorage.getItem('token');
            await axios.delete(`http://localhost:3000/api/medicines/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMedicines(medicines.filter(medicine => medicine.id !== id));
            message.success("Medicine deleted successfully.");
        } catch (error) {
            message.error("Failed to delete medicine.");
        }
    };

    const columns = [
        {
            title: 'Medicine Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => (
                <Tooltip title={text}>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{text}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `$${parseFloat(price).toFixed(2)}`
        },
        {
            title: 'Stock',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity) => quantity
        },
        {
            title: 'Stock Status',
            key: 'stockStatus',
            render: (text, record) => (
                <Tag color={record.quantity <= 0 ? 'gray' : record.quantity < LOW_STOCK_THRESHOLD ? 'red' : 'green'}>
                    {record.quantity <= 0 ? 'Out of Stock' : record.quantity < LOW_STOCK_THRESHOLD ? 'Low Stock' : 'In Stock'}
                </Tag>
            )
        },
        {
            title: 'Expiration Date',
            dataIndex: 'expiry_date',
            key: 'expiry_date',
            render: (date) => {
                const formattedDate = new Date(date).toLocaleDateString();
                return isNaN(new Date(date).getTime()) ? 'Invalid Date' : formattedDate;
            }
        },
        {
            title: 'Supplier',
            dataIndex: 'supplier',
            key: 'supplier',
            render: (supplier) => supplier || 'N/A'
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            render: (location) => location || 'N/A'
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (category) => category || 'N/A'
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} style={{ borderRadius: 50 }} onClick={() => showEditMedicineModal(record)}>Edit</Button>
                    <Button icon={<DeleteOutlined />} style={{ borderRadius: 50 }} danger onClick={() => deleteMedicine(record.id)}>Delete</Button>
                </Space>
            )
        }
    ];

    return (
        <div className="medicines-container">
            { role === 'admin' ? <AdminSidebar/> : <PharmacistSidebar/> }

            <main className="main-content">
                <header className="header">
                    <div className='header-left'>
                        <h1>Medicines</h1>
                        <p>Dashboard / Medicines</p>
                    </div>
                    <div className='header-right'>
                        <Avatar size={50} icon={<UserOutlined />} />
                    </div>
                </header>
                <section className="medicines-table">
                    <Button className='add-button' type="primary" icon={<PlusOutlined />} onClick={showAddMedicineModal} style={{ marginBottom: 16, borderRadius: 50 }}>
                        Add Medicine
                    </Button>
                    <Table columns={columns} dataSource={medicines} loading={loading} />
                </section>
                <AddMedicineForm visible={isAddModalVisible} onCreate={handleAddMedicine} onCancel={handleCancel} categories={categories} suppliers={suppliers} locations={locations} />
                <EditMedicineForm visible={isEditModalVisible} onEdit={handleEditMedicine} onCancel={handleCancel} medicine={editingMedicine} />
            </main>
        </div>
    );
};

export default Medicines;
