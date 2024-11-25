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
    LoginOutlined
} from '@ant-design/icons';
import { Avatar, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import logo from '../imgs/trace.svg';
import './Profile.css';
//Profile.js
//Mock data for the profile display and functionalities test
const Profile = () => {
    const [profile, setProfile] = useState({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        username: 'johndoe',
        avatar: null, // Add avatar state
    });

    // Handle profile input changes
    const handleInputChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    // Handle avatar upload
    const handleAvatarChange = info => {
        if (info.file.status === 'done') {
            // Set the new avatar URL (mock for now, replace with real URL in production)
            setProfile({ ...profile, avatar: URL.createObjectURL(info.file.originFileObj) });
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    return (
        <div className="profile-container">
            {/* Sidebar Navigation */}
            <aside className="sidebar">
                <div className="border">
                    <img src={logo} alt='MediMaster' className='logo-image'/>
                    <h2>Medi<br/>Master</h2>
                </div>
                <div className='menu'>
                    <nav className="nav">
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
                                    <LoginOutlined/> Logout
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
                        <h1>User Profile</h1>
                        <p>Dashboard / User Profile</p>
                    </div>
                    <div className='header-right'>
                        <Avatar size={50} icon={<UserOutlined/>} src={profile.avatar}/>
                    </div>
                </header>

                <section className="profile-form">
                    <div className="avatar-section">
                        <Avatar size={100} src={profile.avatar} icon={<UserOutlined />} />
                        <Upload
                            name="avatar"
                            showUploadList={false}
                            action="/" // Replace with your upload endpoint
                            onChange={handleAvatarChange}
                        >
                            <Button style={{margin: 20, borderRadius: 50}} icon={<UploadOutlined />}>Change Avatar</Button>
                        </Upload>
                    </div>
                    <div className="form-group">
                        <label>Public Profile</label>
                        <Input
                            name="name"
                            value={profile.name}
                            onChange={handleInputChange}
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className="form-group">
                        <label>Username</label>
                        <Input
                            name="username"
                            value={profile.username}
                            onChange={handleInputChange}
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <Input
                            name="email"
                            value={profile.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-actions">
                        <Button type="primary">Save Changes</Button>
                        <Button type="default">Cancel</Button>
                    </div>
                </section>
            </main>
        </div>
    );
};
export default Profile;
