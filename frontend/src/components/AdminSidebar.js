import React from 'react';
import {
    HomeOutlined,
    MedicineBoxOutlined,
    AppstoreOutlined,
    TeamOutlined,
    FileTextOutlined,
    UserOutlined,
    LoginOutlined,
    TruckOutlined,
} from '@ant-design/icons';
import logo from '../imgs/trace.svg'; // Replace with the correct path to your logo file
import './AdminSidebar.css'; // Optional: Import CSS for styling if needed

const AdminSidebar = () => {
    return (
        <aside className="sidebar">
            <div className="border">
                <img src={logo} alt="MediMaster" className="logo-image" />
                <h2>
                    Medi
                    <br />
                    Master
                </h2>
            </div>
            <nav>
                <ul>
                    <li>
                        <a href="/admin-dashboard">
                            <HomeOutlined /> Admin
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
                            <TruckOutlined /> Suppliers
                        </a>
                    </li>
                    <li>
                        <a href="/sales-invoices">
                            <FileTextOutlined /> Sales & Invoices
                        </a>
                    </li>
                    <li>
                        <a href="/users-manage">
                            <UserOutlined /> Users
                        </a>
                    </li>
                    <li>
                        <a href='/customers-manage'>
                            <TeamOutlined/> Customers
                        </a>
                    </li>
                    <li>
                        <a href="/">
                            <LoginOutlined /> Logout
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default AdminSidebar;
