import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  MedicineBoxOutlined,
  AppstoreOutlined,
  TeamOutlined,
  FileTextOutlined,
  BarChartOutlined,
  UserOutlined,
  LoginOutlined
} from '@ant-design/icons';
import { Avatar, message } from "antd";
import axios from "axios";
import logo from '../imgs/trace.svg';
import './PharmacistDashboard.css';

const PharmacistDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [nearExpiryAlerts, setNearExpiryAlerts] = useState([]);
  const [outOfStockAlerts, setOutOfStockAlerts] = useState([]); // New state for out-of-stock medicines
  const [isPharmacist, setIsPharmacist] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
      message.error("Please log in first.");
      navigate('/');
      return;
    }

    //fetch profile
    axios.get('http://localhost:3000/api/users/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
        .then(response => {
          const {role, name} = response.data;
          setUserName(name);
          if (role === 'pharmacist') {
            setIsPharmacist(true);
            fetchDashboardData();
          } else {
            message.error("Unauthorized access.");
            navigate('/admin-dashboard');
          }
        })
        .catch(() => {
          message.error("Error fetching user role. Please log in again.");
          navigate('/');
        });
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = sessionStorage.getItem('token');

      // Fetch low-stock medicines
      const lowStockResponse = await axios.get('http://localhost:3000/api/medicines/low-stock', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLowStockAlerts(lowStockResponse.data);

      // Fetch near-expiry medicines
      const nearExpiryResponse = await axios.get('http://localhost:3000/api/medicines/near-expiry', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNearExpiryAlerts(nearExpiryResponse.data);

      // Fetch out-of-stock medicines
      const outOfStockResponse = await axios.get('http://localhost:3000/api/medicines/out-of-stock', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOutOfStockAlerts(outOfStockResponse.data);

    } catch (error) {
      message.error("Failed to load dashboard data");
    }
  };

  if (!isPharmacist) {
    return null;
  }

  return (
      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="border">
            <img src={logo} alt='MediMaster' className='logo-image' />
            <h2>Medi<br />Master</h2>
          </div>
          <div className='menu'>
            <nav className="nav">
              <ul>
                <li>
                  <a href="/dashboard">
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
                  <a href="/reports">
                    <BarChartOutlined /> Reports
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

        <main className="main-content">
          <header className="header">
            <div className='header-left'>
              <h1>Welcome Back, {userName}</h1>
              <p>Overview of the pharmacy's current status.</p>
            </div>
            <div className='header-right'>
              <Avatar size={50} icon={<UserOutlined />} />
            </div>
          </header>
          <section className="alerts">
            <div className="out-stock">
              <h2>Out Of Stock</h2>
              <ul>
                {outOfStockAlerts.map((alert) => (
                    <li key={alert.id}>
                      {alert.name} - {alert.quantity} left - {alert.Location?.name || 'No location'}
                    </li>
                ))}
              </ul>
            </div>
            <div className="low-stock">
              <h2>Low Stock</h2>
              <ul>
                {lowStockAlerts.map((alert) => (
                    <li key={alert.id}>
                      {alert.name} - {alert.quantity} left - {alert.Location?.name || 'No location'}
                    </li>
                ))}
              </ul>
            </div>
            <div className="near-expiry">
              <h2>Near-Expiry</h2>
              <ul>
                {nearExpiryAlerts.map((alert) => (
                    <li key={alert.id}>
                      {alert.name} - Expires on {new Date(alert.expiry_date).toLocaleDateString()} - {alert.Location?.name || 'No location'}
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
