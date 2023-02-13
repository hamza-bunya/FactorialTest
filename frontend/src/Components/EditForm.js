import React, { useEffect } from 'react';
import { Button, Form, Input, Modal } from 'antd';


const EditForm = ({showModal, submitContact, onCancel, contact}) => {

    const [editForm] = Form.useForm();

    const submit = (values) => {
        submitContact(values);
        onCancel();
    }

    const closeModal = () => {
        editForm.resetFields();
        onCancel();
    }

    return (
        <Modal title="Edit Contact" open={showModal} destroyOnClose closable={false} onCancel={onCancel} footer={null} >
            <div style={{padding: '10px'}}>
                <Form name='EditForm' initialValues={contact} form={editForm} {...layout} onFinish={submit} >
                    <Form.Item hidden name="id">
                        <Input />
                    </Form.Item>
                    <Form.Item label="First Name" name="firstName" rules={[
                        {
                            required: true,
                            message: "Please enter the first name"
                        }
                    ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Last Name" name="lastName" rules={[
                        {
                            required: true,
                            message: "Please enter the last name"
                        }
                    ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[
                        {
                            required: true,
                            message: "Please enter the email"
                        },
                        {
                            type: "email",
                            message: "Please enter a valid email"
                        }
                    ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Phone Number" name="phone" rules={[
                        {
                            required: true,
                            message: "Please enter the phone number"
                        }
                    ]}>
                        <Input />
                    </Form.Item>
                    <hr />
                    <Button style={{float: 'right', marginLeft: 10}} type='primary' htmlType='submit'>Submit</Button>
                    <Button style={{float: 'right'}} type='secondary' onClick={closeModal}>Close</Button>
                </Form>
            </div>
        </Modal>
    )
}

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

export default EditForm;