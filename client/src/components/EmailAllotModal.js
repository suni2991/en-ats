import React, { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';

const EmailAllotModal = ({ visible, onClose, onAllotEmail, candidateId }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    const emailDomain = email.split('@')[1];
    if (emailDomain !== 'enfuse-solutions.com') {
      message.error('Email must be from the domain @enfuse-solutions.com');
      return;
    }

    setLoading(true);
    await onAllotEmail(candidateId, email);
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      title="Allot Email"
      visible={visible}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={loading}
    >
      <Form>
        <Form.Item
          label="Email"
          rules={[
            { required: true, message: 'Please input the email address' },
            {
              type: 'email',
              message: 'Please enter a valid email address',
            },
          ]}
        >
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmailAllotModal;
