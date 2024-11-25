import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../imgs/trace.svg';
import { Input, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/users/login', {
                username,
                password
            });

            const { token } = response.data;

            // Save the token
            if (remember) {
                localStorage.setItem('token', token);
            } else {
                sessionStorage.setItem('token', token);
            }

            // Fetch user profile to check role
            const profileResponse = await axios.get('http://localhost:3000/api/users/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const role = profileResponse.data.role;
            sessionStorage.setItem('userRole', role);

            // Navigate based on role
            if (role === 'pharmacist') {
                navigate('/dashboard');
            } else if (role === 'admin') {
                navigate('/user-dashboard');
            } else {
                message.error("Unauthorized role");
            }
        } catch (error) {
            message.error("Invalid username or password");
        }
    };

    return (
        <div className='login-container'>
            <div className='login-form'>
                <img src={logo} className='logo' alt="MediMaster Logo"/>
                <h1>MediMaster</h1>
                <p>Sign in to access your dashboard.</p>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <Input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                            prefix={<UserOutlined />}
                        />
                    </div>
                    <a href="#" className="forgot-password">Forgot Password?</a>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <Input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            prefix={<LockOutlined />}
                        />
                    </div>

                    <div className="input-group remember-me">
                        <input
                            type="checkbox"
                            id="remember"
                            checked={remember}
                            onChange={() => setRemember(!remember)}
                        />
                        <label htmlFor="remember" className={remember ? 'active-label' : ''}>
                            Remember for 30 days
                        </label>
                    </div>

                    <button type="submit" className="login-button">Sign In</button>
                </form>
                <p className="no-account">
                    No account? <a href="#">Create an account</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
