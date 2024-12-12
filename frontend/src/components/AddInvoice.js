import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Table, Select, InputNumber, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const AddInvoice = ({ visible, onCancel }) => {
    const [form] = Form.useForm();
    const [items, setItems] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [itemQuantity, setItemQuantity] = useState(1);

    useEffect(() => {
        fetchMedicines();
        fetchCustomers();
    }, []);

    const fetchMedicines = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/medicines', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMedicines(response.data);
        } catch (error) {
            message.error("Failed to fetch medicines data.");
        }
    };

    const fetchCustomers = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/customers', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCustomers(response.data);
        } catch (error) {
            message.error("Failed to fetch customer data.");
        }
    };

    const handleAddItem = () => {
        if (!selectedMedicine) {
            message.error("Please select a medicine.");
            return;
        }
    
        const price = Number(selectedMedicine.price); // Chuyển giá trị về số
        if (isNaN(price)) {
            message.error("Invalid price for the selected medicine.");
            return;
        }
    
        const newItem = {
            key: items.length + 1,
            medicine_id: selectedMedicine.id,
            name: selectedMedicine.name,
            quantity: itemQuantity,
            price: price,
            total: itemQuantity * price,
        };
        setItems([...items, newItem]);
        setSelectedMedicine(null);
        setItemQuantity(1);
    };
    
    

    const handleSave = () => {
        form.validateFields().then((values) => {
            const payload = {
                invoice_date: new Date().toISOString(),
                type: "sale", // Đảm bảo giá trị là 'sale' hoặc 'purchase'
                customer_id: values.customer_id,
                items: items.map((item) => ({
                    medicine_id: item.medicine_id,
                    quantity: item.quantity,
                })),
            };
    
            console.log("Payload being sent:", payload); // Log giá trị 'type' để kiểm tra
    
            axios.post('http://localhost:3000/api/invoices', payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then(() => {
                message.success("Invoice created successfully!");
                onCancel();
            })
            .catch((error) => {
                console.error("Error creating invoice:", error.response || error.message);
                message.error("Failed to create invoice");
            });
        });
    };
    

    const columns = [
        {
            title: 'Item Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => (typeof price === 'number' ? `$${price.toFixed(2)}` : 'N/A'),
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (total) => (typeof total === 'number' ? `$${total.toFixed(2)}` : 'N/A'),
        },
    ];
    
    

    return (
        <Modal
            visible={visible}
            title="Add Invoice"
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="save" type="primary" onClick={handleSave}>
                    Save
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="customer_id" label="Customer" rules={[{ required: true }]}>
                    <Select placeholder="Select a customer">
                        {customers.map((customer) => (
                            <Option key={customer.id} value={customer.id}>
                                {customer.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                    <Select>
                        <Option value="Paid">Paid</Option>
                        <Option value="Pending">Pending</Option>
                        <Option value="Overdue">Overdue</Option>
                    </Select>
                </Form.Item>

                <div style={{ marginBottom: 16 }}>
                    <Select
                        placeholder="Select a medicine"
                        value={selectedMedicine?.name || null}
                        onChange={(value) => {
                            const medicine = medicines.find((m) => m.id === value);
                            setSelectedMedicine(medicine);
                        }}
                        style={{ width: '40%', marginRight: 8 }}
                    >
                        {medicines.map((medicine) => (
                            <Option key={medicine.id} value={medicine.id}>
                                {medicine.name}
                            </Option>
                        ))}
                    </Select>
                    <InputNumber
                        min={1}
                        placeholder="Quantity"
                        value={itemQuantity}
                        onChange={(value) => setItemQuantity(value)}
                        style={{ width: '20%', marginRight: 8 }}
                    />
                    <Button type="primary" onClick={handleAddItem}>
                        Add Item
                    </Button>
                </div>

                <Table columns={columns} dataSource={items} pagination={false} rowKey="name" />
            </Form>
        </Modal>
    );
};

export default AddInvoice;
