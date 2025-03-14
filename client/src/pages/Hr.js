import React, { useState, useEffect } from "react";
import { Tooltip, Button, Input, Modal, Table, Select } from "antd";
import { FiGrid } from "react-icons/fi";
import { FaTableList } from "react-icons/fa6";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import CandidateCard from "../components/CandidateCard";
import CandidateTable from "../components/CandidateTable";
import Registration from "../components/Registration";
import Hotpicks from "../components/Hotpicks";
import * as XLSX from "xlsx";

const URL = process.env.REACT_APP_API_URL;
const { Option } = Select;

const Hr = () => {
  const [view, setView] = useState("tile");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTotalModalVisible, setIsTotalModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("All");
  const { auth, token } = useAuth();
  const [candidates, setCandidates] = useState([]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const showTotalModal = () => {
    setIsTotalModalVisible(true);
  };

  const closeTotalModal = () => {
    setIsTotalModalVisible(false);
  };

  const toggleView = () => {
    setView(view === "tile" ? "table" : "tile");
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDownload = () => {
    const filteredCandidatesForDownload = candidates.map(({ confirmPassword,history, round, resume, image,notification,role,empCount, _id, password, __v, roleId, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(filteredCandidatesForDownload);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");
    XLSX.writeFile(workbook, "candidates.xlsx");
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `${URL}/api/candidatesreport`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCandidates(response.data.reverse());
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearchQuery = candidate.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.position?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilterOption = (filterOption === "All") ||
      (filterOption === "Campus Drive" && candidate.isCampusDrive) ||
      (filterOption === "Bulk Upload" && candidate.isBulkUploadData && !candidate.isCampusDrive) ||
      (filterOption === "CTS" && !candidate.isBulkUploadData && !candidate.isCampusDrive);

    return matchesSearchQuery && matchesFilterOption &&
      !["CV Rejected", "Rejected", "Revoked"].some(status => candidate.status?.includes(status));
  });

  const columns = [
    { title: 'Full Name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Position', dataIndex: 'position', key: 'position' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  return (
    <div className="table-container">
      <div className="topContainer">
        <div className="add-button-container">
          <Tooltip title="Add Applicant" color="cyan" >
            <Button onClick={showModal} type="text" className="add-button">
              Add New Candidate
            </Button>
            {/* <Button onClick={showTotalModal} type="text" className="add-button">
              Total Applicants: {candidates.length}
            </Button> */}
          </Tooltip>
          <Select
            defaultValue="All"
            style={{ width: 200, marginLeft: 10 }}
            onChange={setFilterOption}
          >
            <Option value="All">All</Option>
            <Option value="Campus Drive">Campus Drive</Option>
            <Option value="Bulk Upload">Bulk Upload</Option>
            <Option value="CTS">CTS</Option>
          </Select>
        </div>
        <div className="search-toggle">
          {view === "tile" && (
            <Input
              placeholder="Search by Name, Position, Status"
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
            <span className='btn-divider'>&nbsp; | &nbsp;</span>
            <Button onClick={toggleView} type='text' icon={<FaTableList />} className={view === 'table' ? 'active-button' : ''}>
              Grid View
            </Button>
          </div>
        </div>
      </div>
      <br />
      <div>
        {view === "tile" ? (
          <CandidateCard candidates={filteredCandidates} />
        ) : (
          <CandidateTable auth={auth} />
        )}
      </div>
      <div>
        <div>
          <Hotpicks />
        </div>
      </div>
      <Modal
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
        width={800}
        title={<h2>Add New Applicant</h2>}
      >
        <Registration closeModal={closeModal} />
      </Modal>
      <Modal
        open={isTotalModalVisible}
        onCancel={closeTotalModal}
        footer={[
          <Button key="download" onClick={handleDownload}>
            Download
          </Button>,
          <Button key="close" onClick={closeTotalModal}>
            Close
          </Button>,
        ]}
        width={1000}      
      >
        <Table dataSource={candidates} columns={columns} rowKey="id" />
      </Modal>
    </div>
  );
};

export default Hr;