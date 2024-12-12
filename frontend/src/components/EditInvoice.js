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
        if (invoice) {

            form.setFieldsValue({
                ...invoice,
                customer_id: invoice.customer_id, // Prepopulate the customer_id
            });
            
            const sanitizedItems = invoice.items.map((item, index) => ({
                ...item,
                key: item.key || index, // Đảm bảo mỗi item có `key`
                price: Number(item.price), // Chuyển đổi `price` thành số
                total: item.quantity * Number(item.price), // Tính lại `total`
            }));
            form.setFieldsValue(invoice);
            setItems(sanitizedItems);
        }

        fetchMedicines();
        fetchCustomers();
    }, [invoice, form]);

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

    const handleItemChange = (key, value, field) => {
        const updatedItems = items.map((item) =>
            item.key === key
                ? {
                      ...item,
                      [field]: field === 'quantity' ? Number(value) : item[field],
                      total:
                          field === 'quantity'
                              ? Number(value) * item.price
                              : item.quantity * Number(value),
                  }
                : item
        );
        setItems(updatedItems);
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
            render: (quantity, record) => (
                <Input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => handleItemChange(record.key, e.target.value, 'quantity')}
                />
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `$${price.toFixed(2)}`,
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
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

            <Form.Item label="Customer" name="customer_id" rules={[{ required: true }]}>
                <Select placeholder="Select Customer">
                    {customers.map((customer) => (
                        <Option key={customer.id} value={customer.id}>
                            {customer.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
                <Table columns={columns} dataSource={items} pagination={false} rowKey="name" />
            </Form>
        </Modal>
    );
};

export default EditInvoice;
