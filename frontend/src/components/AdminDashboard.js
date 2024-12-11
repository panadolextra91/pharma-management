import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, message } from "antd";
import axios from "axios";
import {UserOutlined} from "@ant-design/icons";
import logo from "../imgs/trace.svg";
import { getSessionData } from "../utils/sessionUtils"; // Centralized session utils
import "./PharmacistDashboard.css";
import AdminSidebar from "./AdminSidebar";

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
            <AdminSidebar></AdminSidebar>

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
