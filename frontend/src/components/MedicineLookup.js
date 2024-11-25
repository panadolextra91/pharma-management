// MedicineLookup.js
import React, { useState } from "react";
import {
    HomeOutlined,
    MedicineBoxOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    LoginOutlined,
} from '@ant-design/icons';
import { Avatar, Input, Table, Space } from "antd";
import logo from '../imgs/trace.svg';
import './MedicineLookup.css';
import at from '../imgs/at.JPG';

const MedicineLookup = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [medicines, setMedicines] = useState([
        // Mock data for demonstration
        {
            key: '1',
            name: 'Paracetamol',
            category: 'Pain Relief',
            description: 'Used for pain management and fever reduction',
            imageUrl: at,
        },
        {
            key: '2',
            name: 'Ibuprofen',
            category: 'Anti-inflammatory',
            description: 'Helps reduce inflammation and pain',
            imageUrl: at,
        },
        {
            key: '3',
            name: 'Vitamin C',
            category: 'Supplements',
            description: 'Essential vitamin for immune support',
            imageUrl: at,
        },
    ]);

    // Filtered medicines based on search term
    const filteredMedicines = medicines.filter((medicine) =>
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Column definitions for the medicines table
    const columns = [
        {
            title: 'Image',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (imageUrl) => <Avatar shape="square" size={45} src={imageUrl} />
        },
        {
            title: 'Medicine Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category'
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '50%'
        }
    ];

    return (
        <div className="medicine-lookup-container">
            {/* Sidebar Navigation */}
            <aside className="sidebar">
                <div className="border">
                    <img src={logo} alt='MediMaster' className='logo-image' />
                    <h2>Medi<br />Master</h2>
                </div>
                <div className='menu'>
                    <nav className="nav">
                        <ul>
                            <li>
                                <a href="/user-dashboard">
                                    <HomeOutlined /> Dashboard
                                </a>
                            </li>
                            <li>
                                <a href="/purchase-history">
                                    <ShoppingCartOutlined /> Purchase History
                                </a>
                            </li>
                            <li>
                                <a href="/medicine-lookup">
                                    <MedicineBoxOutlined /> Medicine Lookup
                                </a>
                            </li>
                            <li>
                                <a href="/profile">
                                    <UserOutlined /> User Profile
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
                        <h1>Medicine Lookup</h1>
                        <p>User Dashboard / Medicine Lookup</p>
                    </div>
                    <div className='header-right'>
                        <Avatar size={50} icon={<UserOutlined />} />
                    </div>
                </header>
                <section className='search-container'>
                    {/* Search bar */}
                    <Input
                        className='search-bar'
                        placeholder="Search for a medicine"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        //style={{ marginBottom: 16, width: '100%' }}
                    />
                </section>
                <section className="medicines-table">

                    {/* Medicines table */}
                    <Table columns={columns} dataSource={filteredMedicines} pagination={false} />
                </section>
            </main>
        </div>
    );
};

export default MedicineLookup;
