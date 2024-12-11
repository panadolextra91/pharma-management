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
import "./PharmacistDashboard.css";
import PharmacistSidebar from "./PharmacistSidebar";

const PharmacistDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [nearExpiryAlerts, setNearExpiryAlerts] = useState([]);
  const [outOfStockAlerts, setOutOfStockAlerts] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("userRole");

    if (!token || role !== "pharmacist") {
      message.error("Unauthorized access.");
      navigate(role === "admin" ? "/admin-dashboard" : "/");
      return;
    }

    fetchUserProfile();
    fetchDashboardData();
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserName(response.data.name);
    } catch (error) {
      message.error("Failed to fetch user profile.");
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const lowStockResponse = await axios.get("http://localhost:3000/api/medicines/low-stock", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLowStockAlerts(lowStockResponse.data);

      const nearExpiryResponse = await axios.get(
          "http://localhost:3000/api/medicines/near-expiry",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
      );
      setNearExpiryAlerts(nearExpiryResponse.data);

      const outOfStockResponse = await axios.get(
          "http://localhost:3000/api/medicines/out-of-stock",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
      );
      setOutOfStockAlerts(outOfStockResponse.data);
    } catch (error) {
      message.error("Failed to load dashboard data.");
    }
  };

  const handleAvatarClick = () => {
    navigate('/profile');
  }

  return (
      <div className="dashboard-container">
        <PharmacistSidebar/>

        <main className="main-content">
          <header className="header">
            <div className="header-left">
              <h1>Welcome Back, {userName}</h1>
              <p>Overview of the pharmacy's current status.</p>
            </div>
            <div className="header-right">
              <div onClick={handleAvatarClick} style={{cursor: 'pointer'}}>
              <Avatar size={50} icon={<UserOutlined />} />
              </div>
            </div>
          </header>
          <section className="alerts">
            <div className="out-stock">
              <h2>Out Of Stock</h2>
              <ul>
                {outOfStockAlerts.map((alert) => (
                    <li key={alert.id}>
                      {alert.name} - {alert.quantity} left - {alert.Location?.name || "No location"}
                    </li>
                ))}
              </ul>
            </div>
            <div className="low-stock">
              <h2>Low Stock</h2>
              <ul>
                {lowStockAlerts.map((alert) => (
                    <li key={alert.id}>
                      {alert.name} - {alert.quantity} left - {alert.Location?.name || "No location"}
                    </li>
                ))}
              </ul>
            </div>
            <div className="near-expiry">
              <h2>Near-Expiry</h2>
              <ul>
                {nearExpiryAlerts.map((alert) => (
                    <li key={alert.id}>
                      {alert.name} - Expires on{" "}
                      {new Date(alert.expiry_date).toLocaleDateString()} -{" "}
                      {alert.Location?.name || "No location"}
                    </li>
                ))}
              </ul>
            </div>
          </section>
        </main>
      </div>
  );
};

export default PharmacistDashboard;
