import React, { useState } from "react";
import Fetchtable from "../components/Fetchtable";
import { Tooltip, Button, Modal, Popconfirm, message } from "antd";
import Createhr from "../components/Createhr";
import axios from "axios";
import { MdOutlineDeleteOutline } from "react-icons/md";
import useAuth from "../hooks/useAuth";

const URL = process.env.REACT_APP_API_URL;
const Admin = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { token } = useAuth();

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
      width: "300px",
    },
    {
      name: "Department",
      selector: (row) => row.department,
      sortable: true,
      width: "150px",
    },
    {
      name: "Location",
      cell: (row) => row.currentLocation,
      sortable: true,
      width: "150px",
    },
    {
      name: "Role",
      width: "120px",
      cell: (row) => (
        <div
          style={{
            backgroundColor: getRoleColor(row.role),
            color: "white",
            padding: "5px 10px",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          {row.role}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <Popconfirm
          title="Are you sure to delete this candidate?"
          onConfirm={() => handleDelete(row._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger>
            <MdOutlineDeleteOutline size={20} />
          </Button>
        </Popconfirm>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const getRoleColor = (role) => {
    switch (role) {
      case "HR":
        return "#00B4d2";
      case "Panelist":
        return "#1a2763";
      case "Ops-Manager":
        return "#54ab6a";
      default:
        return "black";
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${URL}/candidate/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success("Candidate deleted successfully");

      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error deleting candidate:", error);
      message.error("Failed to delete candidate. Please try again later.");
    }
  };

  return (
    <div className="vh-page">
      <div>
        <Fetchtable
          url={`${URL}/hrs`}
          columns={userColumns}
          key={refreshKey}
          extraContent={
            <Tooltip title="Create HR/Panelist" color="cyan">
              <Button
                onClick={showModal}
                className="add-button"
                type="primary"
                style={{ marginTop: "1px" }}
              >
                Create User
              </Button>
            </Tooltip>
          }
        />
      </div>
      <Modal
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
        width={800}
        title={<h2>Create ATS User</h2>}
      >
        <Createhr closeModal={closeModal} />
      </Modal>
    </div>
  );
};

export default Admin;
