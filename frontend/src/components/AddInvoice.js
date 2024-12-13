import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Form, Input, Button, Table, Select, InputNumber, message } from 'antd';
import axios from 'axios';
import debounce from 'lodash.debounce';

const { Option } = Select;

const AddInvoice = ({ visible, onCancel }) => {
    const [form] = Form.useForm();
    const [items, setItems] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [itemQuantity, setItemQuantity] = useState(1);
    const [customerPhone, setCustomerPhone] = useState('');
    const [loadingCustomer, setLoadingCustomer] = useState(false);

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                message.error("Authentication token is missing.");
                return;
            }
            const response = await axios.get('http://localhost:3000/api/medicines', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMedicines(response.data);
        } catch (error) {
            message.error("Failed to fetch medicines data.");
        }
    };

    const searchCustomer = async (phone) => {
        try {
            setLoadingCustomer(true);
            const token = sessionStorage.getItem('token');
            if (!token) {
                message.error("Authentication token is missing.");
                return;
            }

            const response = await axios.get(
                `http://localhost:3000/api/customers/phone/${phone}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data) {
                form.setFieldsValue({ customer_name: response.data.name });
                message.success("Customer found!");
            } else {
                form.setFieldsValue({ customer_name: null });
                message.warning("No customer found. A new customer will be created if left blank.");
            }
        } catch (error) {
            console.error("Error fetching customer:", error);
            message.error("Failed to fetch customer.");
        } finally {
            setLoadingCustomer(false);
        }
    };

    const debouncedSearch = useCallback(
        debounce((phone) => {
            if (phone) {
                searchCustomer(phone);
            } else {
                form.setFieldsValue({ customer_name: null });
            }
        }, 500),
        [] // Empty dependencies ensure this is created only once
    );

    const handlePhoneChange = (phone) => {
        setCustomerPhone(phone);
        debouncedSearch(phone);
    };

    const handleAddItem = () => {
        if (!selectedMedicine) {
            message.error("Please select a medicine.");
            return;
        }

        const price = Number(selectedMedicine.price);
        if (isNaN(price)) {
            message.error("Invalid price for the selected medicine.");
            return;
        }

        const existingItemIndex = items.findIndex((item) => item.medicine_id === selectedMedicine.id);
        if (existingItemIndex >= 0) {
            // Nếu medicine đã tồn tại, cập nhật số lượng và tổng giá trị
            const updatedItems = [...items];
            updatedItems[existingItemIndex].quantity += itemQuantity;
            updatedItems[existingItemIndex].total =
                updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].price;
            setItems(updatedItems);
        } else {
            // Nếu medicine chưa tồn tại, thêm mới
            const newItem = {
                key: items.length + 1,
                medicine_id: selectedMedicine.id,
                name: selectedMedicine.name,
                quantity: itemQuantity,
                price: price,
                total: itemQuantity * price,
            };
            setItems([...items, newItem]);
        }

        setSelectedMedicine(null);
        setItemQuantity(1);
    };

    const handleQuantityChange = (key, newQuantity) => {
        if (newQuantity === 0) {
            // Xóa medicine nếu số lượng = 0
            setItems(items.filter((item) => item.key !== key));
        } else {
            // Cập nhật số lượng và tổng giá trị
            const updatedItems = items.map((item) =>
                item.key === key
                    ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
                    : item
            );
            setItems(updatedItems);
        }
    };


    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            const token = sessionStorage.getItem("token");
            if (!token) {
                message.error("Authentication token is missing.");
                return;
            }

            let customerId = null;

            if (!values.customer_name || !customerPhone) {
                // const customerPayload = {
                //     name: values.customer_name || "",
                //     phone: customerPhone,
                // };

                // const customerResponse = await axios.post(
                //     "http://localhost:3000/api/customers",
                //     customerPayload,
                //     { headers: { Authorization: `Bearer ${token}` } }
                // );

                // customerId = customerResponse.data.id;
            } else {
                const response = await axios.get(
                    `http://localhost:3000/api/customers/phone/${customerPhone}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                customerId = response.data.id;
            }

            const payload = {
                invoice_date: new Date().toISOString(),
                type: values.status,
                customer_id: customerId,
                items: items.map((item) => ({
                    medicine_id: item.medicine_id,
                    quantity: item.quantity,
                })),
            };

            await axios.post("http://localhost:3000/api/invoices", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            message.success("Invoice created successfully!");
            handleCancel();
        } catch (error) {
            console.error("Error creating invoice or customer:", error.response?.data || error.message);
            message.error("Failed to create invoice");
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setItems([]);
        setSelectedMedicine(null);
        setItemQuantity(1);
        setCustomerPhone('');
        onCancel();
    };

    const columns = [
        {
            title: "Item Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            render: (quantity, record) => (
                <InputNumber
                    min={0}
                    value={quantity}
                    onChange={(value) => handleQuantityChange(record.key, value)}
                />
            ),
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price) => (typeof price === "number" ? `$${price.toFixed(2)}` : "N/A"),
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            render: (total) => (typeof total === "number" ? `$${total.toFixed(2)}` : "N/A"),
        },
    ];


    return (
        <Modal
            visible={visible}
            title="Add Invoice"
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="save" type="primary" onClick={handleSave} disabled={!items.length}>
                    Save
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="customer_phone"
                    label="Customer Phone"
                    rules={[{ required: false, message: "Please enter customer phone number!" }]}
                >
                    <Input
                        placeholder="Enter customer phone"
                        value={customerPhone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        disabled={loadingCustomer}
                    />
                </Form.Item>

                <Form.Item name="customer_name" label="Customer Name">
                    <Input placeholder="Customer name will appear here or can be left blank" />
                </Form.Item>

                <Form.Item name="status" label="Type" rules={[{ required: true }]}>
                    <Select
                        placeholder="Select type"
                    >
                        <Option value="sale">Sale</Option>
                        <Option value="purchase">Purchase</Option>
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

                <Table columns={columns} dataSource={items} pagination={false} rowKey="key" />
            </Form>
        </Modal>
    );
};

export default AddInvoice;
