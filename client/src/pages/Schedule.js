import React, { useState } from 'react';
import { Modal, Button, Tooltip, Input, message, Card, Col, Row, DatePicker, TimePicker, Form } from 'antd';
import Fetchtable from '../components/Fetchtable';
import { MdOutlineAddTask,MdAssignmentTurnedIn } from "react-icons/md";
import { TiEyeOutline } from "react-icons/ti";
import moment from 'moment';
import useAuth from '../hooks/useAuth';
import axios from 'axios';

const { RangePicker } = DatePicker;
const URL = process.env.REACT_APP_API_URL;

const Schedule = () => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRequestModalVisible, setIsRequestModalVisible] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');
  const [requestingCandidate, setRequestingCandidate] = useState(null);
  const [requestedDateRange, setRequestedDateRange] = useState([]); // For storing the date range
  const { auth, token } = useAuth();
  const [isBookModalVisible, setIsBookModalVisible] = useState(false); // State for book modal
  const [bookedDate, setBookedDate] = useState(null); // Date for booking
  const [fromTime, setFromTime] = useState(null); // From time for booking
  const [toTime, setToTime] = useState(null); // To time for booking
  const [loading, setLoading] = useState(false);


  const gridStyle = {
    width: '30%',
    minWidth: '150px', // Minimum width to avoid drag issues
    textAlign: 'center',
    margin: '5px',
    
    borderWidth: '2px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  };

  const gridContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  };
  const userColumns = [
    {
      name: "Name",
      selector: (row) => row.fullName,
      sortable: true,
      cell: (row) => (
        <span className="custom-cell" style={{ textTransform: "capitalize" }}>
          {row.fullName}
        </span>
      ),
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      cell: (row) => <span className="custom-cell">{row.email}</span>,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div>
          <Tooltip title="Request Slot" color='cyan'>
            <button className='table-btn' name='Request slot' onClick={() => openRequestModal(row)}>
              <MdOutlineAddTask />
            </button>
          </Tooltip>
          <Tooltip title="View slots" color='cyan'>
            <button className='table-btn' name='View' onClick={() => handleView(row)}>
              <TiEyeOutline />
            </button>
          </Tooltip>
          <Tooltip title="Book slot" color='cyan'>
            <button className='table-btn' name='Book' onClick={() => openBookSlotModal(row)}>
              <MdAssignmentTurnedIn />
            </button>
          </Tooltip>
        </div>
      ),
      width: '150px'
    },
  ];

  const openRequestModal = (row) => {
    setRequestingCandidate(row);
    setIsRequestModalVisible(true);
  };


  const handleView = (row) => {
    setSelectedCandidate(row);
    setIsModalVisible(true);
  };

  const openBookSlotModal = (row) => {
    setSelectedCandidate(row);
    setIsBookModalVisible(true);
  };

  const handleBookSlotCancel = () => {
    setIsBookModalVisible(false);
    setBookedDate(null);
    setFromTime(null);
    setToTime(null);
  };

  const handleBookSlotSubmit = async () => {
    if (!bookedDate || !fromTime || !toTime) {
      message.error('Please select date and time');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        availableSlot: {
          availableDate: bookedDate.format('YYYY-MM-DD'),
          fromTime: fromTime,
          toTime: toTime,
        },
        notification: {
          message: "Slot booked successfully",
          actionRequired: false,
        },
      };

      await axios.post(`${URL}/candidates/${selectedCandidate._id}/availability`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      message.success('Slot booked successfully');
      setIsBookModalVisible(false);
    } catch (error) {
      console.error('Failed to book slot:', error);
      message.error('Failed to book slot');
    } finally {
      setLoading(false);
      // Reset booking state
      setBookedDate(null);
      setFromTime(null);
      setToTime(null);
    }
  };

  const formatDateRange = (dateRange) => {
    if (dateRange && dateRange.length === 2) {
      const fromDate = moment(dateRange[0]).format('DD-MM-YYYY');
      const toDate = moment(dateRange[1]).format('DD-MM-YYYY');
      console.log(`From ${fromDate} To ${toDate}`); // Moved before return
      return `From ${fromDate} To ${toDate}`;
    }
    return 'Invalid Date Range';
  };
  

  const handleRequest = async () => {
    if (!requestedDateRange || requestedDateRange.length !== 2) {
      message.error('Please select a valid date range');
      return;
    }

    try {
      const response = await fetch(`${URL}/slot/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          panelistEmail: requestingCandidate.email,
          candidateName: requestingCandidate.fullName,
          message: emailMessage,
          postedBy: auth.fullName,
          requestedDateRange: [
            requestedDateRange[0].toISOString(),
            requestedDateRange[1].toISOString(),
          ],
        }),
      });
  
      if (response.ok) {
        message.success('Request sent successfully');
      } else {
        message.error('Failed to send request');
      }
    } catch (error) {
      console.error('Error sending request:', error);
      message.error('An error occurred while sending the request');
    } finally {
      setIsRequestModalVisible(false);
      setEmailMessage('');
      setRequestedDateRange([]);
    }
  };
  

  const handleRequestCancel = () => {
    setIsRequestModalVisible(false);
    setEmailMessage('');
    setRequestedDateRange([]);
  };

  const [formattedDateRange, setFormattedDateRange] = useState('');

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      setRequestedDateRange([
        dates[0].startOf('day'),
        dates[1].endOf('day'),
      ]);
      setFormattedDateRange(formatDateRange([dates[0], dates[1]]));
    } else {
      setRequestedDateRange([]);
      setFormattedDateRange('Invalid Date Range');
    }
  };
  
  

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const disabledDate = (current) => {
    // Disable dates before today and after 60 days from today
    const today = moment();
    const maxDate = moment().add(10, 'days');
    return current && (current < today.startOf('day') || current > maxDate.endOf('day'));
  };

  return (
    <div className="vh-page">
      <Fetchtable 
        url={`${URL}/panelists/enfusian`}
        columns={userColumns}
      />

<Modal
      title="Panelist Available Slots"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="ok" onClick={handleOk}>
          OK
        </Button>,
      ]}
    >
      {selectedCandidate && (
        <div>
          <p><strong>Name:</strong> {selectedCandidate.fullName}</p>
          <p><strong>Email:</strong> {selectedCandidate.email}</p>
          
          <p><strong>Available Slots:</strong></p>
          <Row gutter={16}>
            <Card title="Available Slots">
              {selectedCandidate.availableSlots && selectedCandidate.availableSlots.length > 0 ? (
                selectedCandidate.availableSlots.slice(-7).map((slot, index) => (
                  <Card.Grid
                    key={`${slot.fromTime}-${index}`} // Use a unique key
                    hoverable={!slot.booked}
                    style={{
                      ...gridStyle,
                      borderColor: slot.booked ? 'red' : 'green',
                    }}
                  >
                    <p style={{ fontSize: '12px', margin: '0px' }}>
                      {moment(slot.fromTime).local().format('hh:mm A')} - {moment(slot.toTime).local().format('hh:mm A')}
                    </p>
                    <p>{moment(slot.availableDate).local().format('DD-MM-YYYY')}</p>
                    <p style={{ color: slot.booked ? 'red' : 'green' }}>
                      {slot.booked ? 'Booked' : 'Available'}
                    </p>
                  </Card.Grid>
                ))
              ) : (
                <p style={{ color: 'gray', fontStyle: 'italic' }}>No available slots</p>
              )}
            </Card>
          </Row>
        </div>
      )}
    </Modal>

    <Modal
        title={`Book Slot for ${selectedCandidate?.fullName}`}
        open={isBookModalVisible}
        onOk={handleBookSlotSubmit}
        onCancel={() => setIsBookModalVisible(false)}
        confirmLoading={loading}
        okText="Book Slot"
        cancelText="Cancel"
      >
        <Form layout="vertical">
          <Form.Item label="Select Date">
            <DatePicker
              onChange={(date) => setBookedDate(date)}
              format="DD-MM-YYYY"
              style={{ width: '100%' }}
              placeholder="Select Date"
              disabledDate={disabledDate}
            />
          </Form.Item>

          <Form.Item label="From Time">
            <TimePicker
              onChange={(time) => setFromTime(time)}
              format="h:mm A"
              style={{ width: '100%' }}
              placeholder="Select Start Time"
              use12Hours
            />
          </Form.Item>

          <Form.Item label="To Time">
            <TimePicker
              onChange={(time) => setToTime(time)}
              format="h:mm A"
              style={{ width: '100%' }}
              placeholder="Select End Time"
              use12Hours
            />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Modal for requesting slot */}
      <Modal
        title="Request Slot"
        open={isRequestModalVisible}
        onOk={handleRequest}
        onCancel={handleRequestCancel}
        okText="Send Request"
      >
        <p><strong>Name:</strong> {requestingCandidate?.fullName}</p>
        <p><strong>Email:</strong> {requestingCandidate?.email}</p>
        <Input.TextArea
          rows={4}
          placeholder="Enter your message here"
          value={emailMessage}
          onChange={(e) => setEmailMessage(e.target.value)}
        />
        <RangePicker
          onChange={handleDateChange}
          value={requestedDateRange}
          style={{ width: '100%', marginTop: '10px' }}
          format="DD-MM-YYYY"
          placeholder={['From Date', 'To Date']}
          disabledDate={disabledDate}
        />
      </Modal>
    </div>
  );
};

export default Schedule;
