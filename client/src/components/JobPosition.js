import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Tooltip, Legend, Cell, LineChart, Line } from "recharts";
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
const URL = process.env.REACT_APP_API_URL;

const JobPositionPieChart = ({ department }) => {
  const { auth, setAuth } = useAuth();
  const [vacanciesData, setVacanciesData] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(department || '');
  const [clickedPosition, setClickedPosition] = useState([]);
  const [jobLocation, setJobLocation] = useState(null);
  const [positionData, setPositionData] = useState([]);
  const [onboardedCounts, setOnboardedCounts] = useState({});
  const { token } = useAuth();

  const deptList = [
    "Data and Digital-DND",
    "PACS",
    "EdTech & Catalog Operations (ECO)",
    "Analytics & Insights",
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
    'Shortlist to HR': 'brown',
    'L1 Assigned': "#8884d8",
    'L2 Assigned': "#83a6ed",
    Onboarded: "#8dd1e1",
    HR: "#a4de6c",
    Processing: "grey",
    'Screening Done': "violet",
  };

  useEffect(() => {
    const fetchVacanciesData = async () => {
      try {
        if (selectedDepartment) {
          // console.log("fetchVacanciesData: ");
          // console.log(selectedDepartment);

          const response = await axios.get(
            `${URL}/positions-with-vacancies/${selectedDepartment}`,
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
                `${URL}/vacancy-status/${pos.position}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              const tempOnboardedCount = res.data.filter((item) => item._id === "Onboarded")
              // console.log("tempOnboardedCount: ");
              // console.log(tempOnboardedCount);

              const onboardedCount = tempOnboardedCount.reduce((acc, item) => acc + item.count, 0);
              // console.log("onboardedCount: ");
              // console.log(onboardedCount);

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

  // useEffect(() => {
  //   const fetchPositionData = async () => {
  //     try {
  //       if (clickedPosition) {
  //         const response = await axios.get(
  //           `${URL}/vacancy-status/${clickedPosition[0]?.position}`,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //             },
  //           }
  //         );
  //         console.log("response: ", response);
  //         console.log("response.data: ", response.data);
  //         const formattedData = response.data.reduce((acc, item, index) => {
  //           // console.log(index+1, "item: ");
  //           // console.log(item);
  //           acc[item._id] = item.count;
  //           // console.log("Result of "+(index+1)+" iteration:");
  //           // console.log(acc);
  //           return acc;
  //         }, {});
  //         console.log("formattedData: ");
  //         console.log(formattedData);
  //         setPositionData(prevData => {
  //           prevData.push(formattedData);
  //           return prevData;
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Error fetching position data:", error);
  //     }
  //   };

  //   fetchPositionData();
  // }, [clickedPosition]);

  const handleDepartmentChange = (value) => {
    setSelectedDepartment(value);
    console.log("selectedDepartment:");
    console.log(selectedDepartment);

    setClickedPosition([]);
    setJobLocation(null);
    setPositionData([]);
  };


  const fetchPositionData = async (positionToFetch) => {
    try {
      if (clickedPosition) {
        const response = await axios.get(
          `${URL}/vacancy-status/${positionToFetch}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("response: ", response);
        console.log("response.data: ", response.data);

        setPositionData(response.data);
        // const formattedData = response.data.reduce((acc, item, index) => {
        //   // console.log(index+1, "item: ");
        //   // console.log(item);

        //   if (!acc.interviewStatusData) {
        //     acc.interviewstatusData = {};
        //   }

        //   acc.interviewStatusData[item._id] = item.count;
        //   acc.vacancies = acc.vacancies + item.count;

        //   // console.log("Result of "+(index+1)+" iteration:");
        //   // console.log(acc);
        //   return acc;
        // }, { vacancies: 0, interviewStatusData: {}});
        // console.log("formattedData: ");
        // console.log(formattedData);
        // setPositionData([formattedData]);
      }
    } catch (error) {
      console.error("Error fetching position data:", error);
    }
  };

  const lineForLineChart = positionData;
  console.log("lineForLineChart: ", lineForLineChart);


  const handleClick = (data) => {
    // console.log("handleClick data:");
    // console.log(data);
    const passingPosition = data.name;
    const position = vacanciesData.find((pos) => pos.position === data.name);
    console.log("position in handleClick: ");
    console.log(position);

    // setClickedPosition((prevData) => {
    //   if (prevData.length === 0) {
    //     prevData.push(position)
    //     return prevData;
    //   }
    // });

    setClickedPosition([position]);

    setJobLocation(position ? position.jobLocation : null);

    fetchPositionData(passingPosition);
  };

  const handleDownloadReport = async () => {
    try {
      const responsePositions = await axios.get(
        `${URL}/positions-with-vacancies/${selectedDepartment}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const positionsData = responsePositions.data.positions;

      const vacancyStatusPromises = positionsData.map(async (position) => {
        const response = await axios.get(
          `${URL}/vacancy-status/${position.position}`,
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

  const filteredVacanciesData = selectedDepartment ? vacanciesData.map((pos) => ({
    name: pos.position,
    value: pos.vacancies,
  })) : [];

  // let combinedVacanciesStatusData;

  useEffect(() => {
    // const objectClickedPosition = clickedPosition;
    // console.log(typeof objectClickedPosition);
    // console.log('objectClickedPosition: ');
    // console.log(objectClickedPosition);
    console.log('clickedPosition: ');
    console.log(clickedPosition);

    // if (clickedPosition && clickedPosition.length > 0) {
    //   console.log('clickedPosition[0].position: ');
    //   console.log(clickedPosition[0].position);
    // }

    // const objectPositionData = positionData;
    // console.log(typeof objectPositionData);
    // console.log('objectPositionData: ');
    // console.log(objectPositionData);
    console.log(' useEfect formattedData positionData: ');
    console.log(positionData);

    const combinedVacanciesStatusData = [...clickedPosition, ...positionData];
    console.log("combinedVacanciesStatusData : ");
    console.log(combinedVacanciesStatusData);

  }, [clickedPosition, positionData, selectedDepartment]);

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
          height: "50px",
          width: "100%",
          boxSizing: "border-box",
          boxShadow: "0px 1px 2px rgb(38, 39, 130)",
        }}
      >

        {
          auth.role === "Hiring-Manager" && (
            <Select
              placeholder="Select Department"
              style={{ width: 240 }}
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              disabled={true}
            // defaultValue={selectedDepartment}
            // allowClear
            >
              {selectedDepartment}
              {/* {deptList.map((dept) => (
                <Option key={dept} value={dept}>
                  {dept}
                </Option>
              ))} */}
            </Select>
          )}

        {(auth.role === "Admin" || auth.role === "HR") && (
          <Select
            placeholder="Select Department"
            style={{ width: 240 }}
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            // disabled={true}
            allowClear
          >
            {deptList.map((dept) => (
              <Option key={dept} value={dept}>
                {dept}
              </Option>
            ))}
          </Select>
        )}
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "98%",
          background: "white",
          padding: "10px",
          boxShadow: "0px 2px 4px rgb(38, 39, 130)"
        }}
      >
        {/* Pie Chart Section */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "5px" }}>
            <h1>Job Vacancies by Position</h1>
            <p>Click on a segment to see detailed information about the position's status.</p>
          </div>
          {filteredVacanciesData && filteredVacanciesData.length > 0 ? (
            <PieChart width={400} height={400} cursor="pointer">
              <Pie
                dataKey="value"
                data={filteredVacanciesData}
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
                onClick={handleClick}
                style={{ outline: "none" }}
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
            </PieChart>
          ) : (
            <div>No data available for the selected department</div>
          )}
        </div>

        {/* Bar Chart Section */}
        <div style={{ flex: 1, marginLeft: "20px" }}>
          {clickedPosition && clickedPosition.length > 0 ? (
            lineForLineChart.length > 0 && Object.keys(lineForLineChart[0]).length > 0 ? (
              <>
                <div
                  style={{
                    marginBottom: "10px",
                    padding: "5px",
                    background: "#f9f9f9",
                    textAlign: "center",
                    fontWeight: "bold",
                    border: "1px solid #cccccc",
                  }}
                >
                  {clickedPosition[0].position}
                  {jobLocation && `, ${jobLocation}`}
                </div>

                <div style={{ marginTop: '15px', paddingRight: '15px' }}>
                  <LineChart width={800} height={400} data={lineForLineChart}>
                    <XAxis dataKey="_id" />
                    <YAxis dataKey="count" />
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                    <Tooltip />
                    <Legend />
                    <Line type="linear" dataKey="count" stroke="#8884d8" />
                  </LineChart>
                </div>


                {/* <BarChart width={500} height={350} data={positionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id"/>
                  <YAxis  />
                  <BarTooltip />
                  <BarLegend />
                  {Object.keys(vacancyStatusColors).map((status, index) => (
                    <Bar
                      key={index}
                      dataKey={status}
                      fill={vacancyStatusColors[status]}
                    />
                  ))}
                </BarChart> */}
              </>
            ) : (
              <div
                style={{
                  alignItems: "center",
                  margin: "180px 0px 0px 30px",
                  color: "red",
                }}
              >
                No Applicant registered for {clickedPosition[0].position} yet
              </div>
            )
          ) : null}
        </div>
      </div>

    </div>
  );
};

export default JobPositionPieChart;