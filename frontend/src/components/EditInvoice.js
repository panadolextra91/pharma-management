import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Table, Select } from 'antd';
//EditInvoice.js
const { Option } = Select;

const EditInvoice = ({ visible, onEdit, onCancel, invoice }) => {
    const [form] = Form.useForm();
    const [items, setItems] = useState(invoice ? invoice.items : []);

    // useEffect(() => {
    //     if (invoice) {
    //         form.setFieldsValue(invoice);
    //         setItems(invoice.items);
    //     }
    // }, [invoice, form]);

    useEffect(() => {
        if (invoice) {
            const sanitizedItems = invoice.items.map((item, index) => ({
                ...item,
                key: item.key || index, // Đảm bảo mỗi item có `key`
                price: Number(item.price), // Chuyển đổi `price` thành số
                total: item.quantity * Number(item.price), // Tính lại `total`
            }));
            form.setFieldsValue(invoice);
            setItems(sanitizedItems);
        }
    }, [invoice, form]);
    

    const handleSave = () => {
        form.validateFields().then((values) => {
            onEdit({ ...invoice, ...values, items });
        });
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
                <Form.Item name="customerName" label="Customer Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                    <Select>
                        <Option value="Paid">Paid</Option>
                        <Option value="Pending">Pending</Option>
                        <Option value="Overdue">Overdue</Option>
                    </Select>
                </Form.Item>
                <Table columns={columns} dataSource={items} pagination={false} rowKey="name" />
            </Form>
        </Modal>
    );
};

export default EditInvoice;
