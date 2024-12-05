// UserDashboard.js
import React from 'react';
import { Avatar, Button, Card, Col, Row } from 'antd';
import {
    MedicineBoxOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    FileTextOutlined, HomeOutlined, AppstoreOutlined, TeamOutlined, BarChartOutlined, LoginOutlined,
} from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';
import logo from "../imgs/trace.svg";

const AdminDashboard = () => {
    const navigate = useNavigate();
    return (
        <div className="dashboard-container">
            {/* Sidebar Navigation */}
            <aside className="sidebar">
                <div className="border">
                    <img src={logo} alt='MediMaster' className='logo-image'/>
                    <h2>Medi<br/>
                        Master</h2>
                </div>
                <div className='menu'>
                    <nav className="nav">
                        <ul>

                            <li>
                                <a href="/user-dashboard">
                                    <HomeOutlined/> Dashboard
                                </a>
                            </li>
                            <li>
                                <a href="/purchase-history">
                                    <ShoppingCartOutlined/> Purchase History
                                </a>
                            </li>
                            <li>
                                <a href="/medicine-lookup">
                                    <MedicineBoxOutlined/> Medicine Lookup
                                </a>
                            </li>

                            <li>
                                <a href="/profile">
                                    <UserOutlined/> User Profile
                                </a>
                            </li>
                            <li>
                                <a href='/'>
                                    <LoginOutlined/> Logout
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>
        </div>
    );
};
export default AdminDashboard;
