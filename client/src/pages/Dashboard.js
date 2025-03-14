import React, { useState, useEffect } from "react";
import { Button, Input, Modal, Spin, Table, Tooltip, Select } from "antd";
import { FiGrid } from "react-icons/fi";
import { FaTableList } from "react-icons/fa6";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import JobDashboard from "../components/JobDashboard";
import Viewjob from "../components/Viewjob";
import Postjob from "../components/Postjob";
import JobPositionPieChart from "../components/JobPosition";
import { Cell } from "recharts";
import moment from "moment";
import ViewJobModal from "./ViewJobModal";
// import ViewJobModal from "./ViewJobModal";

const URL = process.env.REACT_APP_API_URL;
const { Option } = Select;
const Dashboard = () => {
  const { auth } = useAuth();
  const [view, setView] = useState("tile");
  const [isAddNewJobModalVisible, setIsAddNewJobModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingJobs, setPendingJobs] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("REQ Approved");
  const [jobs, setJobs] = useState([]);
  const { token } = useAuth();

  const daysRemaining = selectedJob ? moment(selectedJob.fullfilledBy).diff(moment(), 'days') : 0;

  // const [editFields, setEditFields] = useState({
  //   position: "",
  //   department: "",
  //   jobLocation: "",
  //   experience: "",
  //   vacancies: "",
  //   postedBy: "",
  //   status: "",
  //   description: "",
  //   note: "",
  //   fullfilledBy: ""
  // });

  // useEffect(() => {
  //   const fetchJobs = async () => {
  //     try {
  //       console.log('useEffect token: ', token);

  //       // console.log("Parameters for fetching jobs:", {
  //       //   mgrRole: auth.role,
  //       //   fullName: auth.fullName,
  //       // });

  //       const response = await axios.get(`${URL}/api/viewjobs`, {
  //         params: { mgrRole: auth.role, fullName: auth.fullName },
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       setJobs(response.data.reverse());
  //     } catch (error) {
  //       console.error("Error fetching jobs:", error);
  //     }
  //   };

  //   if (auth.role && auth.fullName) {
  //     fetchJobs();
  //   }
  // }, [auth.role, auth.fullName]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        console.log('useEffect token: ', token);
  
        const params = { mgrRole: auth.role, fullName: auth.fullName };
        if (auth.role === 'HiringManager') {
          params.department = auth.department;
        }
  
        const response = await axios.get(`${URL}/api/viewjobs`, {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setJobs(response.data.reverse());
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
  
    if (auth.role && auth.fullName) {
      fetchJobs();
    }
  }, [auth.role, auth.fullName, auth.department]);

  useEffect(() => {
    const fetchPendingJobs = async () => {
      try {
        const response = await axios.get(`${URL}/api/pendingjobs`, {
          params: { mgrRole: auth.role, fullName: auth.fullName },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPendingJobs(response.data.reverse());
      } catch (error) {
        console.error("Error fetching pending jobs:", error);
      }
    };

    fetchPendingJobs();
  }, [auth.role, auth.fullName, token]);


  const handleRowButtonClick = async (jobId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${URL}/api/job-posts/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const job = response.data;
      setSelectedJob(job);
     
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsAddNewJobModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEditClicked(false);
  };

  const getStatusCounts = (jobs) => {
    const statusCounts = jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {});
    return statusCounts;
  };
  
  const statusCounts = getStatusCounts(jobs);
  const selectedStatusCount = statusCounts[selectedStatus] || 0;

  const closeModal = () => {
    setIsAddNewJobModalVisible(false);
  };

  const toggleView = () => {
    setView(view === "tile" ? "table" : "tile");
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // const filteredJobs = jobs.filter(
  //   (job) =>
  //     (job.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     job.jobLocation.toLowerCase().includes(searchQuery.toLowerCase())) &&
  //     job.status === selectedStatus
  // );

  
  const filteredJobs = jobs.filter(
    (job) =>
      (job.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.jobLocation.toLowerCase().includes(searchQuery.toLowerCase())) &&
      job.status === selectedStatus &&
      (auth.role !== 'HiringManager' || job.department === auth.department)
  );
  
  
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const columns = [
    {
      title: "Posted Date",
      dataIndex: "postedAt",
      key: "postedAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      render: (position) => capitalizeFirstLetter(position),
      onCell: (row) => ({
        style: { cursor: 'pointer'},
        className: 'hoverable-cell',
        onClick: () => { handleRowButtonClick(row._id) },
      })
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Note",
      key: "note",
      render: (text, record) => {
        const lastHistory = record.history && record.history[record.history.length - 1];
        return lastHistory ? lastHistory.note : "No notes available";
      },
    },
  ];

  const getRowClassName = (record) => {
    if (record.status === "Waiting for Approval") {
      return "approval-pending-row";
    }
    if (record.status === "Denied") {
      return "denied-row";
    }
    return "";
  };

  return (
    <div className="dashboard-container">
      <div className="topContainer">
        <Tooltip title="Post a Job" color="cyan">
          <Button
            colorprimary="cyan"
            onClick={showModal}
            type="text"
            className="add-button"
            style={{ float: "left" }}
          >
            Add New Job
          </Button>
        </Tooltip>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select
            defaultValue="REQ Approved"
            style={{ width: 200 }}
            onChange={(value) => setSelectedStatus(value)}
          >
            <Option value="Closed">Closed</Option>
            <Option value="REQ Approved">REQ Approved</Option>
            <Option value="REQ on Hold">REQ on Hold</Option>
            <Option value="REQ Fullfilled">REQ Fullfilled</Option>
          </Select>
          <span style={{ marginLeft: '10px' }}>Count: {selectedStatusCount}</span>
        </div>
        {view === "tile" && (
          <Input
            placeholder="Search jobs"
            value={searchQuery}
            onChange={handleSearch}
            className="ant-searchIn"
          />
        )}

        <div className="toggle-button">
          <Button
            onClick={toggleView}
            type="text"
            icon={<FiGrid />}
            className={view === "tile" ? "active-button" : ""}
          >
            Tile View
          </Button>
          <span classname='btn-divider'>&nbsp; | &nbsp;</span>
          <Button onClick={toggleView} type='text' icon={<FaTableList />} className={view === 'table' ? 'active-button' : ''}>

            Grid View
          </Button>
        </div>
      </div>
      <br />
      <div>
        {view === "tile" ? (
          <JobDashboard jobs={filteredJobs} selectedStatus={selectedStatus} />
        ) : (
          <Viewjob auth={auth} />
        )}
      </div>

      {auth.role === 'HiringManager' ?
        (
          <div className='stat-repo-dashboard'>
            <JobPositionPieChart department={auth.department} />
          </div>
        ) :
        (
          <div className='stat-repo-dashboard'>
            <JobPositionPieChart />
          </div>
        )
      }

<div
  className="list-applicants"
  style={{ width: "99.5%", marginLeft: "5px", height: "auto" }}
>
  <Table
    dataSource={pendingJobs}
    columns={columns}
    rowKey={(record) => record._id}
    rowClassName={getRowClassName}
    title={() => (
      <h1 style={{ marginBottom: "10px" }}>Requisition Received and Sent for Approval </h1>
    )}
  />
</div>

      <Modal
        open={isAddNewJobModalVisible}
        onCancel={closeModal}
        footer={null}
        title={<h2>Add New Job Posting</h2>}
        width={800}
      >
        <Postjob />
      </Modal>

      <Modal
        title={`This position ends in ${daysRemaining} days`}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <ViewJobModal selectedJob={selectedJob} setSelectedJob={setSelectedJob} isEditClicked={isEditClicked} setIsEditClicked={setIsEditClicked} setIsModalVisible={setIsModalVisible} auth={auth} />
      </Modal>


    </div>
  );
};

export default Dashboard;
