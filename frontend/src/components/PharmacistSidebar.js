import React from 'react';
import { HomeOutlined, MedicineBoxOutlined, AppstoreOutlined, TeamOutlined, FileTextOutlined, UserOutlined, LoginOutlined } from '@ant-design/icons';
import logo from '../imgs/trace.svg'; // Replace with the correct path to your logo file
import './PharmacistSidebar.css'; // Optional: Import CSS for styling if needed

const PharmacistSidebar = () => {
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
                        <a href="/dashboard">
                            <HomeOutlined /> Pharmacy
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
                        <a href="/">
                            <LoginOutlined /> Logout
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default PharmacistSidebar;
