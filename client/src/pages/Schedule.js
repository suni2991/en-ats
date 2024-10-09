import React, { useState } from 'react';
import { Modal, Button, Tooltip, Input, message, Card, Col, Row, DatePicker } from 'antd';
import Fetchtable from '../components/Fetchtable';
import { MdOutlineAddTask } from "react-icons/md";
import { TiEyeOutline } from "react-icons/ti";
import moment from 'moment';
import useAuth from '../hooks/useAuth';

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

  const formatDateRange = (dateRange) => {
    if (dateRange && dateRange.length === 2) {
      const fromDate = moment(dateRange[0]).format('DD-MM-YYYY');
      const toDate = moment(dateRange[1]).format('DD-MM-YYYY');
      return `From ${fromDate} To ${toDate}`;
    }
    return 'Invalid Date Range';
  };

  const handleRequest = async () => {
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
          requestedDateRange: requestedDateRange.map(date => moment(date).format('YYYY-MM-DD')), // Send date range
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
      setRequestedDateRange([]); // Reset date range
    }
  };

  const handleRequestCancel = () => {
    setIsRequestModalVisible(false);
    setEmailMessage('');
    setRequestedDateRange([]);
  };

  const handleDateChange = (dates) => {
    setRequestedDateRange(dates);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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
          <p><strong>Requested Date Range:</strong> {formatDateRange(requestingCandidate?.requestedDateRange)}</p>
          <p><strong>Available Slots:</strong></p>
          <Row gutter={16}>
            {selectedCandidate.availableSlots && selectedCandidate.availableSlots.length > 0 ? (
              selectedCandidate.availableSlots.map((slot, index) => (
                <Col span={8} key={index}>
                  <Card
                    title={slot.booked ? "Booked" : "Available"}
                    bordered={true}
                    style={{
                      borderColor: slot.booked ? 'red' : 'green',
                      margin:'5px',
                      width:'100%'
                    }}
                  >
                    <p style={{fontSize:'10px', marginTop:'0px'}}>{moment(slot.fromTime).local().format('hh:mm A')}-{moment(slot.toTime).local().format('hh:mm A')}</p>
                    <p>{moment(slot.availableDate).local().format('DD-MM-YYYY')}</p>
                  </Card>
                </Col>
              ))
            ) : (
              <p>No available slots</p>
            )}
          </Row>
        </div>
      )}
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
        />
      </Modal>
    </div>
  );
};

export default Schedule;
