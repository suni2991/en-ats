import React, { useState, useEffect } from "react";
import { Button, Input, Modal, Table, Tooltip } from "antd";
import { FiGrid } from "react-icons/fi";
import { FaTableList } from "react-icons/fa6";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import JobDashboard from "../components/JobDashboard";
import Viewjob from "../components/Viewjob";
import Postjob from "../components/Postjob";
import JobPositionPieChart from "../components/JobPosition";


const URL = process.env.REACT_APP_API_URL;
const Dashboard = () => {
  const { auth } = useAuth();
  const [view, setView] = useState("tile");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingJobs, setPendingJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const { token } = useAuth();
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // console.log("Parameters for fetching jobs:", {
        //   mgrRole: auth.role,
        //   fullName: auth.fullName,
        // });
        const response = await axios.get(`${URL}/viewjobs`, {
          params: { mgrRole: auth.role, fullName: auth.fullName },
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
  }, [auth.role, auth.fullName]);

  useEffect(() => {
    const fetchPendingJobs = async () => {
      try {
        const response = await axios.get(`${URL}/pendingjobs`, {
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const toggleView = () => {
    setView(view === "tile" ? "table" : "tile");
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.jobLocation.toLowerCase().includes(searchQuery.toLowerCase())
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
    if (record.status === "Approval Pending") {
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
            colorPrimary="cyan"
            onClick={showModal}
            type="text"
            className="add-button"
            style={{ float: "left" }}
          >
            Add New Job
          </Button>
        </Tooltip>

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
          <JobDashboard jobs={filteredJobs} />
        ) : (
          <Viewjob auth={auth} />
        )}
      </div>


      {auth.role !== 'Ops-Manager' && (
        <div className='stat-repo-dashboard'>

          <JobPositionPieChart />
        </div>
      )}
      <div
        className="list-applicants"
        style={{ height: "auto" }}
      >
        <Table
          dataSource={pendingJobs}
          columns={columns}
          rowKey={(record) => record._id}
          rowClassName={getRowClassName}
          title={() => (
            <h1 style={{ marginBottom: "10px" }}>Jobs Sent for Approval pages dashboard</h1>
          )}
        />
      </div>

      <Modal
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
        title={<h2>Add New Job Posting</h2>}
        width={800}
      >
        <Postjob />
      </Modal>
    </div>
  );
};

export default Dashboard;
