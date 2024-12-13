import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Table, Select, message } from 'antd';
import axios from 'axios';
//EditInvoice.js
const { Option } = Select;

const EditInvoice = ({ visible, onEdit, onCancel, invoice }) => {
    const [form] = Form.useForm();
    const [items, setItems] = useState(invoice ? invoice.items : []);
    const [medicines, setMedicines] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [itemQuantity, setItemQuantity] = useState(1);


    // useEffect(() => {
    //     if (invoice) {
    //         form.setFieldsValue(invoice);
    //         setItems(invoice.items);
    //     }
    // }, [invoice, form]);

    useEffect(() => {
        console.log("Invoice data:", invoice);
    }, [invoice]);
    

    useEffect(() => {
        if (invoice) {
            form.setFieldsValue({
                ...invoice,
            });

            // Nếu customer_name không có, lấy từ API
            if (!invoice.customer_name) {
                fetchCustomerName(invoice.customer_id);
            }

            const sanitizedItems = invoice.items.map((item, index) => ({
                ...item,
                key: item.key || index,
                price: Number(item.price),
                total: item.quantity * Number(item.price),
            }));
            setItems(sanitizedItems);
        }

        fetchMedicines();
    }, [invoice]);

    const fetchCustomerName = async (customerId) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(
                `http://localhost:3000/api/customers/${customerId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            form.setFieldsValue({ customer_name: response.data.name });
        } catch (error) {
            console.error("Failed to fetch customer name:", error);
            message.error("Failed to fetch customer name.");
        }
    };


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

    //
    const handleAddMedicine = () => {
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
            const updatedItems = [...items];
            updatedItems[existingItemIndex].quantity += itemQuantity;
            updatedItems[existingItemIndex].total =
                updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].price;
            setItems(updatedItems);
        } else {
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



    const handleSave = async () => {
        try {
            // const values = await form.validateFields();
            // const token = sessionStorage.getItem('token');

            // const updatedInvoice = {
            //     customer_id: values.customer_id,
            //     status: values.status,
            //     items: items.map(({ medicine_id, quantity, price }) => ({ medicine_id, quantity, price })),
            // };

            // await axios.put(
            //     `http://localhost:3000/api/invoices/${invoice.id}`,
            //     updatedInvoice,
            //     {
            //         headers: { Authorization: `Bearer ${token}` },
            //     }
            // );

            // message.success("Invoice updated successfully.");
            // onEdit(updatedInvoice); // Notify parent component
            const values = await form.validateFields(); // Get form values
            const token = sessionStorage.getItem('token');

            const updatedInvoice = {
                customer_id: values.customer_id,
                items: items.map(({ medicine_id, quantity, price }) => ({
                    medicine_id,
                    quantity,
                    price,
                })),
            };

            // Send update request to the backend
            await axios.put(
                `http://localhost:3000/api/invoices/${invoice.id}`,
                updatedInvoice,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            message.success("Invoice updated successfully.");
            onEdit(updatedInvoice); // Notify parent component
        } catch (error) {
            console.error("Error updating invoice:", error);
            message.error("Failed to update invoice. Please try again.");
        }
    };


    // const handleItemChange = (key, value, field) => {
    //     const updatedItems = items.map((item) =>
    //         item.key === key ? { ...item, [field]: value } : item
    //     );
    //     setItems(updatedItems);
    // };

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
                <Input
                    type="number"
                    min={0}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(record.key, Number(e.target.value))}
                />
            ),
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price) => `$${price.toFixed(2)}`,
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            render: (_, record) => `$${(record.price * record.quantity).toFixed(2)}`,
        },
    ];


    return (
        <Modal
            visible={visible}
            title="Edit Invoice"
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
                <Form.Item label="Customer Name">
                    <Input value={form.getFieldValue("customer_name") || "Private"} disabled />
                </Form.Item>


                <div style={{ marginBottom: 16 }}>
                    <Select
                        placeholder="Select a medicine"
                        value={selectedMedicine?.name || null}
                        onChange={(value) => {
                            const medicine = medicines.find((m) => m.id === value);
                            setSelectedMedicine(medicine);
                        }}
                        style={{ width: "40%", marginRight: 8 }}
                    >
                        {medicines.map((medicine) => (
                            <Option key={medicine.id} value={medicine.id}>
                                {medicine.name}
                            </Option>
                        ))}
                    </Select>
                    <Input
                        type="number"
                        min={1}
                        placeholder="Quantity"
                        value={itemQuantity}
                        onChange={(e) => setItemQuantity(Number(e.target.value))}
                        style={{ width: "20%", marginRight: 8 }}
                    />
                    <Button type="primary" onClick={handleAddMedicine}>
                        Add Medicine
                    </Button>
                </div>

                <Table columns={columns} dataSource={items} pagination={false} rowKey="key" />
            </Form>

        </Modal>
    );
};

export default EditInvoice;