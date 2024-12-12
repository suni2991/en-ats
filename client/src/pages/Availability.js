import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, message } from 'antd';
import moment from 'moment';
import useAuth from '../hooks/useAuth';
import AvailabilityForm from '../components/AvailableSlotForm';

const URL = process.env.REACT_APP_API_URL;

const Availability = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { auth } = useAuth();
  const candidateId = auth?._id;


  const handleDelete = async (slot) => {
    Modal.confirm({
      title: 'Are you sure?',
      content: `Do you really want to delete the slot on ${moment(slot.availableDate).format('YYYY-MM-DD')}?`,
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          const response = await fetch(`${URL}/candidate/slot/${slot._id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          if (response.ok) {
            message.success('Slot deleted successfully');
            await fetchSlots(); // Refresh the available slots
          } else {
            message.error('Failed to delete the slot');
          }
        } catch (error) {
          console.error('Error deleting the slot:', error);
          message.error('An error occurred while deleting the slot');
        }
      },
    });
  };

  // Fetch slots data
  const fetchSlots = async () => {
    try {
      const response = await fetch(`${URL}/candidate/profile/${candidateId}`);
      const result = await response.json();

      if (result.status === 'SUCCESS' && result.data) {
        setAvailableSlots(result.data.availableSlots || []);
      } else {
        message.error('No available slots found');
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
      message.error('Failed to fetch available slots');
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [candidateId]);

  const handleEdit = (slot) => {
    setSelectedSlot(slot);
    form.setFieldsValue({
      availableDate: moment(slot.availableDate),
      availableTime: [moment(slot.fromTime), moment(slot.toTime)],
      bookedStatus: slot.booked,
    });
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = form.getFieldsValue();
      const response = await fetch(`${URL}/candidate/slot/${selectedSlot?._id || ''}`, {
        method: selectedSlot ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          availableDate: values.availableDate.format('YYYY-MM-DD'),
          fromTime: values.availableTime[0].format('HH:mm:ss'),
          toTime: values.availableTime[1].format('HH:mm:ss'),
          booked: values.bookedStatus,
          candidateId,
        }),
      });
  
      if (response.ok) {
        message.success(`Slot ${selectedSlot ? 'updated' : 'added'} successfully`);
        setIsModalVisible(false);
        form.resetFields();
        setSelectedSlot(null);
  
        // Ensure the fetch waits for completion
        await fetchSlots(); 
      } else {
        message.error(`Failed to ${selectedSlot ? 'update' : 'add'} slot`);
      }
    } catch (error) {
      console.error(`Error ${selectedSlot ? 'updating' : 'adding'} slot:`, error);
      message.error(`An error occurred while ${selectedSlot ? 'updating' : 'adding'} the slot`);
    }
  };
  

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    fetchSlots();
    setSelectedSlot(null);
  };

  const columns = [
    {
      title: 'Available Date',
      dataIndex: 'availableDate',
      key: 'availableDate',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Available Time',
      key: 'availableTime',
      render: (text, record) => (
        `${moment(record.fromTime).format('hh:mm A')} - ${moment(record.toTime).format('hh:mm A')}`
      ),
    },
    {
      title: 'Booked',
      dataIndex: 'booked',
      key: 'booked',
      render: (text) => (text ? 'Yes' : 'No'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          danger
          onClick={() => handleDelete(record)}
          type="link"
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="vh-page">
      <Button
        type="primary"
        style={{ backgroundColor: '#00B4D2', marginBottom: '16px' }}
        onClick={() => setIsModalVisible(true)}
      >
        Add a Slot
      </Button>

      <Table
        columns={columns}
        dataSource={availableSlots}
        rowKey="_id"
        pagination={{ pageSize: 7 }}
      />

      <Modal
        title={selectedSlot ? 'Edit Available Slot' : 'Add a Slot'}
        open={isModalVisible}
        footer={null}
        onCancel={handleCancel}
      >
        <AvailabilityForm
          form={form}
          candidateId={candidateId}
          initialValues={selectedSlot ? {
            availableDate: moment(selectedSlot.availableDate),
            availableTime: [moment(selectedSlot.fromTime), moment(selectedSlot.toTime)],
            bookedStatus: selectedSlot.booked,
          } : {}}
        />
      </Modal>
    </div>
  );
};

export default Availability;
