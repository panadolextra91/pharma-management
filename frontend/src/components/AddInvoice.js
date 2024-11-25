import React, { useState } from 'react';
import { Modal, Form, Input, Button, Table, Select, InputNumber } from 'antd';
//AddInvoice.js
const { Option } = Select;

const AddInvoice = ({ visible, onCreate, onCancel }) => {
    const [form] = Form.useForm();
    const [items, setItems] = useState([]);
    const [itemName, setItemName] = useState('');
    const [itemQuantity, setItemQuantity] = useState(1);
    const [itemPrice, setItemPrice] = useState(0);

    const handleAddItem = () => {
        const newItem = {
            key: items.length + 1,
            name: itemName,
            quantity: itemQuantity,
            price: itemPrice,
            total: itemQuantity * itemPrice,
        };
        setItems([...items, newItem]);
        setItemName('');
        setItemQuantity(1);
        setItemPrice(0);
    };

    const handleSave = () => {
        form.validateFields().then((values) => {
            onCreate({ ...values, items, totalAmount: items.reduce((sum, item) => sum + item.total, 0) });
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
            render: (price) => `$${price.toFixed(2)}`,
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (total) => `$${total.toFixed(2)}`,
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

                <div style={{ marginBottom: 16 }}>
                    <Input
                        placeholder="Item Name"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        style={{ width: '40%', marginRight: 8 }}
                    />
                    <InputNumber
                        min={1}
                        placeholder="Quantity"
                        value={itemQuantity}
                        onChange={(value) => setItemQuantity(value)}
                        style={{ width: '10%', marginRight: 8 }}
                    />
                    <InputNumber
                        min={0}
                        placeholder="Price"
                        value={itemPrice}
                        onChange={(value) => setItemPrice(value)}
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
