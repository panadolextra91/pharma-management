import React, { useState, useEffect } from "react";
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Table, Button, Space, message, Avatar, Modal } from "antd";
import AdminSidebar from "./AdminSidebar";
import PharmacistSidebar from "./PharmacistSidebar";
import AddUserForm from "./AddUserForm";
import EditUserForm from "./EditUserForm"; // Import the EditUserForm component
import "./UserManage.css";
import axios from "axios";

const UserManage = () => {
    const [users, setUsers] = useState([]);
    const [isAddUserVisible, setIsAddUserVisible] = useState(false);
    const [isEditUserVisible, setIsEditUserVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const userRole = sessionStorage.getItem("userRole");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get("http://localhost:3000/api/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (error) {
            message.error("Failed to fetch user data.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (values) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:3000/api/users",
                values,
                {
                    headers: { Authorization: `Bearer ${token}` },
                } 
            );
            setUsers([...users, response.data]);
            message.success("User added successfully.");
            setIsAddUserVisible(false);
        } catch (error) {
            message.error("Failed to add user.");
        }
    };

    const handleEditUser = async (values) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.put(
                `http://localhost:3000/api/users/${editingUser.id}`,
                values,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setUsers(
                users.map((user) =>
                    user.id === editingUser.id ? response.data : user
                )
            );
            message.success("User updated successfully.");
            setIsEditUserVisible(false);
            setEditingUser(null);
        } catch (error) {
            message.error("Failed to update user.");
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            const token = sessionStorage.getItem("token");
            await axios.delete(`http://localhost:3000/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(users.filter((user) => user.id !== id));
            message.success("User deleted successfully.");
        } catch (error) {
            message.error("Failed to delete user.");
        }
    };

    const showEditModal = (user) => {
        setEditingUser(user);
        setIsEditUserVisible(true);
    };

    const columns = [
        {
            title: "Avatar",
            dataIndex: "avatar",
            key: "avatar",
            render: (avatar) => (
                <Avatar size={40} icon={<UserOutlined />} src={avatar} />
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
        },
        {
            title: "Actions",
            key: "actions",
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        style={{ borderRadius: 50 }}
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        style={{ borderRadius: 50 }}
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() =>
                            Modal.confirm({
                                title: "Are you sure you want to delete this user?",
                                onOk: () => handleDeleteUser(record.id),
                            })
                        }
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="users-container">
            {/* Sidebar Navigation */}
            {userRole === "admin" ? <AdminSidebar /> : <PharmacistSidebar />}

            {/* Main Content */}
            <main className="main-content">
                <header className="header">
                    <div className="header-left">
                        <h1>User Management</h1>
                        <p>Dashboard / User Management</p>
                    </div>
                    <div className="header-right">
                        <Avatar size={50} icon={<UserOutlined />} />
                    </div>
                </header>
                <section className="users-table">
                    <Button
                        className='add-button'
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsAddUserVisible(true)}
                        style={{ marginBottom: 16 }}
                    >
                        Add User
                    </Button>
                    <Table
                        columns={columns}
                        dataSource={users}
                        rowKey={(record) => record.id}
                        loading={loading}
                    />
                </section>
                <AddUserForm
                    visible={isAddUserVisible}
                    onCreate={handleAddUser}
                    onCancel={() => setIsAddUserVisible(false)}
                />
                <EditUserForm
                    visible={isEditUserVisible}
                    onEdit={handleEditUser}
                    onCancel={() => setIsEditUserVisible(false)}
                    initialValues={editingUser}
                />
            </main>
        </div>
    );
};

export default UserManage;
