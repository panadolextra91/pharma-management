import React, {useEffect} from "react";
import {Modal, Form, Input, Button} from "antd";
//EditCategoryForm.js
const EditCategoryForm = ({visible, onEdit, onCancel, category}) => {
    const [form] = Form.useForm();
    useEffect(() => {
        if (category) {
            form.setFieldValue({
                category: category.category,
                des: category.des
            });
        }
    }, [category, form]);

    return (
        <Modal
            visible={visible}
            title='Edit Category'
            centered
            okText='Save'
            cancelText='Cancel'
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        onEdit(values);
                    })
                    .catch((info) => {
                        console.log('Validate', info);
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="edit_category_form"
            >
                <Form.Item
                    name="category"
                    label="Category Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the category name!',
                        },
                    ]}
                >
                    <Input placeholder="Enter category name" />
                </Form.Item>
                <Form.Item
                    name="des"
                    label="Description"
                >
                    <Input.TextArea placeholder="Enter category description" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditCategoryForm;