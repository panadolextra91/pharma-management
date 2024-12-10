import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, message } from "antd";
import axios from "axios";
import {
    HomeOutlined,
    MedicineBoxOutlined,
    AppstoreOutlined,
    TeamOutlined,
    FileTextOutlined,
    BarChartOutlined,
    UserOutlined,
    LoginOutlined,
} from "@ant-design/icons";
import logo from "../imgs/trace.svg";
import { getSessionData } from "../utils/sessionUtils"; // Centralized session utils
import "./PharmacistDashboard.css";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const { token, role } = getSessionData();

        console.log("Token:", token);
        console.log("Role:", role);

        if (!token || role !== "admin") {
            message.error("Unauthorized access.");
            navigate(role === "pharmacist" ? "/dashboard" : "/");
            return;
        }

        setIsAuthenticated(true);
        fetchUserProfile(token);
    }, [navigate]);

    const fetchUserProfile = async (token) => {
        try {
            const response = await axios.get("http://localhost:3000/api/users/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserName(response.data.name);
        } catch (error) {
            message.error("Failed to fetch user profile.");
        }
    };

    const handleAvatarClick = () => {
        navigate("/profile");
    };

    if (!isAuthenticated) {
        return null; // Prevent rendering until authenticated
    }

    return (
        <div className="dashboard-container">
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
                                <HomeOutlined /> Dashboard
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
                            <a href="/users">
                                <UserOutlined /> User Management
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

            <main className="main-content">
                <header className="header">
                    <div className="header-left">
                        <h1>Welcome Back, {userName}</h1>
                        <p>Overview of the pharmacy's current status.</p>
                    </div>
                    <div className="header-right">
                        <div onClick={handleAvatarClick} style={{ cursor: "pointer" }}>
                            <Avatar size={50} icon={<UserOutlined />} />
                        </div>
                    </div>
                </header>
                <section className="analytics">
                    <h2>Admin Dashboard Analytics</h2>
                    <p>Key metrics and statistics go here...</p>
                </section>
            </main>
        </div>
    );
};

export default AdminDashboard;
