import React from 'react';
import { Modal, Table } from 'antd';
//ViewInvoiceItems.js
const ViewInvoiceItems = ({ visible, items, onClose }) => {
    // Columns for invoice items table
    const columns = [
        {
            title: 'Item Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity'
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `$${price.toFixed(2)}`
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (total) => `$${total.toFixed(2)}`
        }
    ];

    return (
        <Modal
            visible={visible}
            title="Invoice Items"
            footer={null}
            onCancel={onClose}
        >
            <Table
                columns={columns}
                dataSource={items}
                pagination={false}
                rowKey="name"
            />
        </Modal>
    );
};

export default ViewInvoiceItems;
