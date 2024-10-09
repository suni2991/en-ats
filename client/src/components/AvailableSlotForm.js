import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, TimePicker, message, Typography } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { Title } = Typography;

const AvailableSlotForm = ({ form, candidateId, initialValues, latestRequestedDateRange }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const payload = {
        availableSlot: {
          availableDate: values.availableDate,
          fromTime: values.fromTime,
          toTime: values.toTime,
        },
        notification: {
          message: "Slots updated",
          actionRequired: false,
        },
      };

      await axios.post(`http://localhost:5040/candidates/${candidateId}/availability`, payload);
      message.success('Available slot and notification submitted successfully');
      form.resetFields();
    } catch (error) {
      console.error('Failed to submit:', error);
      message.error('Failed to submit available slot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {latestRequestedDateRange && (
        <Title level={4}>Latest Requested Date Range: {moment(latestRequestedDateRange[0]).format('YYYY-MM-DD')} to {moment(latestRequestedDateRange[1]).format('YYYY-MM-DD')}</Title>
      )}
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="availableDate"
          label="Available Slot Date"
          rules={[{ required: true, message: 'Please select the available slot date' }]}
        >
          <DatePicker placeholder="Select Date" format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          name="fromTime"
          label="From Time"
          rules={[{ required: true, message: 'Please select the from time' }]}
        >
          <TimePicker
            format="h:mm A"
            use12Hours
            placeholder="Select From Time"
          />
        </Form.Item>

        <Form.Item
          name="toTime"
          label="To Time"
          rules={[{ required: true, message: 'Please select the to time' }]}
        >
          <TimePicker
            format="h:mm A"
            use12Hours
            placeholder="Select To Time"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ backgroundColor: "#00B4D2" }} loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AvailableSlotForm;