import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PharmacistDashboard from './components/PharmacistDashboard';
import Login from "./components/Login";
import Medicines from './components/Medicines.js';
import Categories from "./components/Categories";
import SalesInvoices from "./components/SalesInvoices";
import Suppliers from './components/Suppliers';
import Profile from './components/Profile';
import UserDashboard from "./components/UserDashboard";

function App() {
    const ProtectedRoute = ({ children, role }) => {
        const storedRole = sessionStorage.getItem('userRole');
        if (storedRole === role) return children;
        return <Navigate to="/" replace />;
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute role="pharmacist">
                        <PharmacistDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/user-dashboard" element={
                    <ProtectedRoute role="admin">
                        <UserDashboard />
                    </ProtectedRoute>
                } />
                <Route path='/medicines' element={<Medicines />} />
                <Route path='/categories' element={<Categories />} />
                <Route path='/suppliers' element={<Suppliers />} />
                <Route path='/sales-invoices' element={<SalesInvoices />} />
                <Route path='/profile' element={<Profile />} />
            </Routes>
        </Router>
    );
}

export default App;
