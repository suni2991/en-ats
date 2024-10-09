import React, { useState, useEffect } from 'react';
import { Table, Button, Tooltip, Modal, Form, message } from 'antd';
import { MdOutlineEdit } from "react-icons/md";

import moment from 'moment';
import useAuth from "../hooks/useAuth"; 
import AvailabilityForm from '../components/AvailableSlotForm';  

const URL = process.env.REACT_APP_API_URL;

const Availability = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { auth } = useAuth();  // Fetch user authentication details
  const candidateId = auth?._id;  // Get the candidate ID from auth
  const [latestRequestedDateRange, setLatestRequestedDateRange] = useState([]);
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await fetch(`${URL}/candidate/profile/${candidateId}`);
        const result = await response.json();

        if (result.status === 'SUCCESS' && result.data) {
          console.log('Fetched availableSlots:', result.data.availableSlots);
          setAvailableSlots(result.data.availableSlots || []);
          
          // Extract the latest requestedDateRange
          if (result.data.availableSlots.length > 0) {
            const sortedSlots = result.data.availableSlots.sort((a, b) => new Date(b.requestedDateRange[1]) - new Date(a.requestedDateRange[1]));
            setLatestRequestedDateRange(sortedSlots[0].requestedDateRange);
          }
        } else {
          message.error('No available slots found');
        }
      } catch (error) {
        console.error('Error fetching available slots:', error);
        message.error('Failed to fetch available slots');
      }
    };

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
      const response = await fetch(`${URL}/candidate/slot/${selectedSlot?._id}`, {
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
        // Refresh the available slots after update or creation
        const updatedSlots = await fetch(`${URL}/candidate/${candidateId}`).then(res => res.json());
        setAvailableSlots(updatedSlots.availableSlots || []);
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
  };

  const columns = [
    {
      title: "Available Date",
      dataIndex: "availableDate",
      key: "availableDate",
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: "Available Time",
      key: "availableTime",
      render: (text, record) => (
        `${moment(record.fromTime).format('hh:mm A')} - ${moment(record.toTime).format('hh:mm A')}`
      ),
    },
    {
      title: "Booked",
      dataIndex: "booked",
      key: "booked",
      render: (text) => (text ? 'Yes' : 'No'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div>
          <Tooltip title="Edit" color='cyan'>
            <button className='table-btn' onClick={() => handleEdit(record)}>
              <MdOutlineEdit />
            </button>
          </Tooltip>
         
        </div>
      ),
    },
  ];

  return (
    <div className="vh-page">
      <Button type='primary' style={{ backgroundColor: "#00B4D2" }} onClick={() => setIsModalVisible(true)}>
        Add a Slot
      </Button>

      <Table 
        columns={columns} 
        dataSource={availableSlots} 
        rowKey="_id" 
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={selectedSlot ? "Edit Available Slot" : "Add a Slot"}
        open={isModalVisible}
        onOk={handleOk}
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
          latestRequestedDateRange={latestRequestedDateRange} 
        />
      </Modal>
    </div>
  );
};

export default Availability;
