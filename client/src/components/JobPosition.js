import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as BarTooltip,
  Legend as BarLegend,
} from "recharts";
import * as XLSX from "xlsx";
import { MdOutlineDownload } from "react-icons/md";
import { Select, Button } from "antd";
import useAuth from "../hooks/useAuth";

const { Option } = Select;

const JobPositionPieChart = () => {
  const [vacanciesData, setVacanciesData] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("Adobe_Team");
  const [clickedPosition, setClickedPosition] = useState("Java Developer");
  const [jobLocation, setJobLocation] = useState(null);
  const [positionData, setPositionData] = useState([]);
  const [onboardedCounts, setOnboardedCounts] = useState({});
  const { token } = useAuth();

  const deptList = [
    "Data and Digital-DND",
    "PACS",
    "EdTech & Catalog Operations (ECO)",
    "Analytics Practice",
    "Adobe_Team",
    "Software Services",
    "Business Development",
    "Human Resources",
    "Administration",
    "IT & Governance",
  ];

  const vacancyStatusColors = {
    Selected: "#82ca9d",
    Rejected: "#f26680",
    L1: "#8884d8",
    L2: "#83a6ed",
    Onboarded: "#8dd1e1",
    HR: "#a4de6c",
    Processing: "grey",
  };

  useEffect(() => {
    const fetchVacanciesData = async () => {
      try {
        if (selectedDepartment) {
          const response = await axios.get(
            `http://localhost:5040/positions-with-vacancies/${selectedDepartment}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setVacanciesData(response.data.positions);

          const onboardedCounts = {};
          await Promise.all(
            response.data.positions.map(async (pos) => {
              const res = await axios.get(
                `http://localhost:5040/vacancy-status/${pos.position}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              const onboardedCount = res.data
                .filter((item) => item._id === "Onboarded")
                .reduce((acc, item) => acc + item.count, 0);
              onboardedCounts[pos.position] = onboardedCount;
            })
          );
          setOnboardedCounts(onboardedCounts);
        }
      } catch (error) {
        console.error("Error fetching vacancies data:", error);
      }
    };

    fetchVacanciesData();
  }, [selectedDepartment]);

  useEffect(() => {
    const fetchPositionData = async () => {
      try {
        if (clickedPosition) {
          const response = await axios.get(
            `http://localhost:5040/vacancy-status/${clickedPosition}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const formattedData = response.data.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {});
          setPositionData([formattedData]);
        }
      } catch (error) {
        console.error("Error fetching position data:", error);
      }
    };

    fetchPositionData();
  }, [clickedPosition]);

  const handleDepartmentChange = (value) => {
    setSelectedDepartment(value);
    setClickedPosition(null);
    setJobLocation(null);
    setPositionData([]);
  };

  const handleClick = (data) => {
    const position = vacanciesData.find((pos) => pos.position === data.name);
    setClickedPosition(data.name);
    setJobLocation(position ? position.jobLocation : null);
  };

  const handleDownloadReport = async () => {
    try {
      const responsePositions = await axios.get(
        `http://localhost:5040/positions-with-vacancies/${selectedDepartment}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const positionsData = responsePositions.data.positions;

      const vacancyStatusPromises = positionsData.map(async (position) => {
        const response = await axios.get(
          `http://localhost:5040/vacancy-status/${position.position}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return { position: position.position, status: response.data };
      });

      const vacancyStatusData = await Promise.all(vacancyStatusPromises);

      const data = positionsData.map((positionData) => {
        const statusData = {};
        const positionStatus = vacancyStatusData.find(
          (item) => item.position === positionData.position
        );
        if (positionStatus) {
          positionStatus.status.forEach((status) => {
            statusData[status._id] = status.count;
          });
        }
        return {
          Department: selectedDepartment,
          Position: positionData.position,
          Vacancies: positionData.vacancies,
          ...statusData,
        };
      });

      const headers = [
        "Department",
        "Position",
        "Vacancies",
        ...Object.keys(vacancyStatusColors),
      ];
      const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
      XLSX.writeFile(workbook, `${selectedDepartment}_Report.xlsx`);
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  const filteredVacanciesData = selectedDepartment
    ? vacanciesData.map((pos) => ({
        name: pos.position,
        value: pos.vacancies,
      }))
    : [];

  const colors = [
    "#8884d8",
    "#83a6ed",
    "#8dd1e1",
    "#82ca9d",
    "#a4de6c",
    "#d0ed57",
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "100%",
      }}
    >
      <div
        style={{
          paddingLeft: "5px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#FFFF",
          height: "48px",
          width: "76vw",
        }}
      >
        <Select
          placeholder="Select Department"
          style={{ width: 240 }}
          value={selectedDepartment}
          onChange={handleDepartmentChange}
          allowClear
        >
          {deptList.map((dept) => (
            <Option key={dept} value={dept}>
              {dept}
            </Option>
          ))}
        </Select>
        <Button
          className="add-button"
          style={{ background: "#A60808" }}
          onClick={handleDownloadReport}
        >
          <MdOutlineDownload />
          Download Report
        </Button>
      </div>
      <br />
      <div className="pie-chart">
        {filteredVacanciesData && filteredVacanciesData.length > 0 ? (
          <PieChart width={400} height={400}>
            <Pie
              dataKey="value"
              data={filteredVacanciesData}
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label
              onClick={handleClick}
            >
              {filteredVacanciesData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                  border="none"
                  strokeWidth={0}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : (
          <div>No data available for the selected department</div>
        )}

        <div style={{ width: "50%", margin: "10px" }}>
          {clickedPosition ? (
            positionData.length > 0 &&
            Object.keys(positionData[0]).length > 0 ? (
              <>
                <p style={{ float: "right", marginBottom: "10px" }}>
                  {clickedPosition}
                  {jobLocation && `, ${jobLocation}`}
                </p>
                <BarChart width={500} height={300} data={positionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <BarTooltip />
                  <BarLegend />
                  {Object.keys(vacancyStatusColors).map((status, index) => (
                    <Bar
                      key={index}
                      dataKey={status}
                      fill={vacancyStatusColors[status]}
                    />
                  ))}
                </BarChart>
              </>
            ) : (
              <div
                style={{
                  alignItems: "center",
                  margin: "180px 0px 0px 30px",
                  color: "red",
                }}
              >
                No Applicant registered for {clickedPosition} yet
              </div>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default JobPositionPieChart;
