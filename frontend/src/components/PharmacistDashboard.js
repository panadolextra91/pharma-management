import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Card, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Bar } from "@ant-design/plots"; // Ensure you have this installed
import axios from "axios";
import { getSessionData } from "../utils/sessionUtils";
import "./PharmacistDashboard.css";
import PharmacistSidebar from "./PharmacistSidebar";

const PharmacistDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [revenueData, setRevenueData] = useState({ income: 0, outcome: 0, total: 0 });
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [nearExpiryAlerts, setNearExpiryAlerts] = useState([]);
  const [outOfStockAlerts, setOutOfStockAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { token, role } = getSessionData();

    if (!token || role !== "pharmacist") {
      message.error("Unauthorized access.");
      navigate(role === "admin" ? "/admin-dashboard" : "/");
      return;
    }

    fetchRevenueData(token);
    fetchDashboardData(token);
    fetchUserProfile(token);
  }, [navigate]);

  const fetchRevenueData = async (token) => {
    try {
      const response = await axios.get("http://localhost:3000/api/invoices/revenue/monthly", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRevenueData(response.data);
    } catch (error) {
      console.error("Failed to fetch revenue data:", error);
      message.error("Unable to load revenue data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async (token) => {
    try {
      const lowStockResponse = await axios.get("http://localhost:3000/api/medicines/low-stock", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLowStockAlerts(lowStockResponse.data);

      const nearExpiryResponse = await axios.get("http://localhost:3000/api/medicines/near-expiry", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNearExpiryAlerts(nearExpiryResponse.data);

      const outOfStockResponse = await axios.get("http://localhost:3000/api/medicines/out-of-stock", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOutOfStockAlerts(outOfStockResponse.data);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      message.error("Unable to load dashboard data.");
    }
  };

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get("http://localhost:3000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserName(response.data.name);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      message.error("Unable to load user profile.");
    }
  };

  const revenueChartConfig = {
    data: [
      { type: "Income", value: revenueData.income },
      { type: "Outcome", value: revenueData.outcome },
    ],
    xField: "type",
    yField: "value",
    colorField: "type",
  };

  const handleAvatarClick = () => navigate("/profile");

  return (
      <div className="dashboard-container">
        <PharmacistSidebar />
        <main className="main-content">
          <header className="header">
            <div className="header-left">
              <h1>Welcome Back, {userName}</h1>
              <p>Overview of the pharmacy's current status.</p>
            </div>
            <div className="header-right" onClick={handleAvatarClick} style={{ cursor: "pointer" }}>
              <Avatar size={50} icon={<UserOutlined />} />
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
              <h2>Near Expiry</h2>
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

          <section className="revenue-section">
            <Card loading={loading} title="Total Revenue This Month" style={{ marginBottom: 16 }}>
              <h2>{`$${revenueData.total.toFixed(2)}`}</h2>
            </Card>
            <Bar {...revenueChartConfig} />
          </section>
        </main>
      </div>
  );
};

export default PharmacistDashboard;
