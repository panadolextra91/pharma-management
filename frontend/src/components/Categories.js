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
    DeleteOutlined
} from '@ant-design/icons';
import { Avatar, Button, Space, Table } from "antd";
import logo from '../imgs/trace.svg';
import './Categories.css';
import EditCategoryForm from "./EditCategoryForm";
import axios from "axios";
import config from '../config';
//Categories.js
const Categories = () => {
    const [currentCategory, setCurrentCategory] = useState(null)
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [categories, setCategories] = useState([
        //Mocking data, we will use true data later
        {
            key: '1',
            category: 'Pain Relief',
            des: 'Medicines for pain management and relief'
        },
        {
            key: '2',
            category: 'Antibiotics',
            des: 'Medicines for treating bacterial infections'
        },
        {
            key: '3',
            category: 'Allergy',
            des: 'Medicines for allergy relief'
        },
        {
            key: '4',
            category: 'Cough & Cold',
            des: 'Medicines for treating cough and cold symptoms'
        },
        {
            key: '5',
            category: 'Digestive Health',
            des: 'Medicines for digestive health support'
        },
        {
            key: '6',
            category: 'Heart & Blood Pressure',
            des: 'Medicines for heart and blood pressure management'
        },
        {
            key: '7',
            category: 'Diabetes',
            des: 'Medicines for managing diabetes'
        },
        {
            key: '8',
            category: 'Skin Care',
            des: 'Medicines and products for skin care'
        },
        {
            key: '9',
            category: 'Vitamins & Supplements',
            des: 'Vitamins and dietary supplements'
        },
        {
            key: '10',
            category: 'First Aid',
            des: 'Products for first aid and emergency care'
        }
    ]);
    const showEditCategoryModal = (key) => {
        const categoryToEdit = categories.find(category => category.key === key);
        setCurrentCategory(categoryToEdit);
        setIsEditModalVisible(true);
    };
    const handleEditCategory = (values) => {
        const updatedCategories = categories.map(category =>
            category.key === currentCategory.key ? { ...category, ...values } : category
        );
        setCategories(updatedCategories);
        setIsEditModalVisible(false);
    };

    const handleCancelEdit = () => {
        setIsEditModalVisible(false);
    };
    const deleteCategory = (key) => {
        // Filter out the category with the matching key
        const updatedCategories = categories.filter(category => category.key !== key);
        setCategories(updatedCategories);
    };

    const columns = [
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category'
        },
        {
            title: 'Description',
            dataIndex: 'des',
            key: 'des'
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} style={{ borderRadius: 50 }} onClick={() => showEditCategoryModal(record.key)}>Edit</Button>
                    <Button icon={<DeleteOutlined />} style={{ borderRadius: 50 }} danger onClick={() => deleteCategory(record.key)}>Delete</Button>
                </Space>
            )
        }
    ];

    return (
        <div className="categories-container">
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
                        <h1>Categories Management</h1>
                        <p>Dashboard / Categories</p>
                    </div>
                    <div className='header-right'>
                        <Avatar size={50} icon={<UserOutlined/>}/>
                    </div>
                </header>
                <section className="categories-table">
                    <Table columns={columns} dataSource={categories} />
                </section>
                <EditCategoryForm
                    visible={isEditModalVisible}
                    onEdit={handleEditCategory}
                    onCancel={handleCancelEdit}
                    category={currentCategory}
                />
            </main>
        </div>
    );
};

export default Categories;
