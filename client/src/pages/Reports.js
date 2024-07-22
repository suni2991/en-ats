import React, { useState, useEffect } from "react";
import Fetchtable from "../components/Fetchtable";
import { Select } from "antd";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const { Option } = Select;

const Reports = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [data, setData] = useState([]);
  const [token] = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = "http://localhost:5040/candidatesreport";
        if (selectedCategory !== "all") {
          url += `?selectedCategory=${selectedCategory}`;
        }
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedCategory]);

  const userColumns = [
    {
      name: "Date",
      selector: (row) => {
        if (row.dateCreated) {
          const date = new Date(row.dateCreated);
          const dateString = date.toLocaleDateString();
          return <span>{dateString}</span>;
        } else {
          return "-";
        }
      },
      sortable: true,
      width: "100px",
    },
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
      width: "200px",
      selector: (row) => row.email,
      sortable: true,
      cell: (row) => <span className="custom-cell">{row.email}</span>,
    },
    {
      name: "Quantitative",
      width: "130px",
      center: true,
      selector: (row) => (row.quantitative !== -1 ? row.quantitative : 0),
      sortable: true,
    },
    {
      name: "Vocabulary",
      width: "125px",
      center: true,
      selector: (row) => (row.vocabulary !== -1 ? row.vocabulary : 0),
      sortable: true,
    },
    {
      name: "Psychometric",
      width: "140px",
      center: true,
      selector: (row) => (row.psychometric !== -1 ? row.psychometric : 0),
      sortable: true,
      omit: selectedCategory === "Non-Technical",
    },
    {
      name: "Java",
      width: "110px",
      center: true,
      selector: (row) => (row.java !== -1 ? row.java : 0),
      sortable: true,
      omit: selectedCategory === "Non-Technical",
    },
    {
      name: "Excel",
      width: "120px",
      center: true,
      selector: (row) => (row.excel !== -1 ? row.excel : 0),
      sortable: true,
      omit: selectedCategory === "Technical",
    },
    {
      name: "Accounts",
      width: "130px",
      center: true,
      selector: (row) => (row.accounts !== -1 ? row.accounts : 0),
      sortable: true,
      omit: selectedCategory === "Technical",
    },
  ];

  return (
    <div className="vh-page">
      <Fetchtable
        url={`http://localhost:5040/candidatesreport`}
        columns={userColumns}
        filteredData={data}
        extraContent={
          <label>
            <Select
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value)}
              style={{ minWidth: "150px", margin: "2px" }}
            >
              <Option value="all">All</Option>
              <Option value="Technical">Technical</Option>
              <Option value="Non-Technical">Non-Technical</Option>
            </Select>
          </label>
        }
      />
    </div>
  );
};

export default Reports;
