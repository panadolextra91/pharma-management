// PurchaseHistory.js
import React, { useState } from "react";
import {
    HomeOutlined,
    MedicineBoxOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    LoginOutlined,
} from '@ant-design/icons';
import { Avatar, Table } from "antd";
import logo from '../imgs/trace.svg';
import './PurchaseHistory.css';
const PurchaseHistory = () => {
    const [purchases, setPurchases] = useState([
        // Mock data for demonstration
        {
            key: '1',
            date: '2023-10-12',
            items: 'Paracetamol, Ibuprofen',
            totalAmount: 25,
        },
        {
            key: '2',
            date: '2023-09-05',
            items: 'Vitamin C',
            totalAmount: 10,
        },
        {
            key: '3',
            date: '2023-08-21',
            items: 'Amoxicillin, Aspirin',
            totalAmount: 45,
        },
    ]);

    // Column definitions for the purchases table
    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date'
        },
        {
            title: 'Items',
            dataIndex: 'items',
            key: 'items'
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount) => `$${amount}`
        }
    ];

    return (
        <div className="purchase-history-container">
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
                        <h1>Purchase History</h1>
                        <p>User Dashboard / Purchase History</p>
                    </div>
                    <div className='header-right'>
                        <Avatar size={50} icon={<UserOutlined />} />
                    </div>
                </header>
                <section className="purchase-table">
                    {/* Purchases Table */}
                    <Table columns={columns} dataSource={purchases} pagination={false} />
                </section>
            </main>
        </div>
    );
};

export default PurchaseHistory;
