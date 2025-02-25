
import { Button, Col, DatePicker, Drawer, Input, List, message, Row, Select, Spin, Tooltip } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Option } from 'antd/es/mentions';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import useAuth from '../hooks/useAuth';
import axios from 'axios';

const URL = process.env.REACT_APP_API_URL;

const ViewJobModal = ({ selectedJob, setSelectedJob, isEditClicked, setIsEditClicked, setIsModalVisible, isEditButtonDisabled }) => {

    // const [isEditClicked, setIsEditClicked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [historyData, setHistoryData] = useState([]);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);

    const { auth, token } = useAuth();
    const daysRemaining = selectedJob ? moment(selectedJob.fullfilledBy).diff(moment(), 'days') : 0;


    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get(`${URL}/api/viewjobs`, {
                    params: { mgrRole: auth.role, fullName: auth.fullName },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setJobs(response.data.reverse());
                // setFilteredJobs(response.data.reverse());
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };

        fetchJobs();
    }, [auth.role, auth.fullName, token]);


    const handleDrawerClose = () => {
        setIsDrawerVisible(false);
    };

    const colors = {
        "REQ Approved": "green",
        "REQ on Hold": "#00B4D2",
        "REQ Fullfilled": "red",
    };

    const [editFields, setEditFields] = useState({
        _id: selectedJob._id,
        position: selectedJob.position,
        department: selectedJob.department,
        description: selectedJob.description,
        jobLocation: selectedJob.jobLocation,
        vacancies: selectedJob.vacancies,
        primarySkills: selectedJob.primarySkills,
        secondarySkills: selectedJob.secondarySkills,
        experience: selectedJob.experience,
        postedBy: selectedJob.postedBy,
        responsibilities: selectedJob.responsibilities,
        jd: selectedJob.jd,
        status: selectedJob.status,
        note: selectedJob.note,
        fullfilledBy: selectedJob.fullfilledBy,
    });

    const handleDateChange = (date, dateString) => {
        if (date && date.isBefore(moment(), "day")) {
            message.error("Fullfilled By date should be a future date");
            setEditFields((prevData) => ({
                ...prevData,
                fullfilledBy: "",
            }));
        } else {
            setEditFields((prevData) => ({
                ...prevData,
                fullfilledBy: dateString,

            }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFields((prevFields) => ({
            ...prevFields,
            [name]: value,
        }));
    };

    const disabledDate = (current) => {
        // Disable dates before today and after 60 days from today
        const today = moment();
        const maxDate = moment().add(240, 'days');
        return current && (current < today.startOf('day') || current > maxDate.endOf('day'));
    };

    const handleSaveChanges = async () => {
        setLoading(true);
        try {
            // Determine which fields have changed
            const changes = [];
            Object.keys(editFields).forEach((key) => {
                if (key !== 'note' && editFields[key] !== selectedJob[key]) {
                    changes.push({ field: key, oldValue: selectedJob[key], newValue: editFields[key] });
                }
            });

            // Create history entry
            const historyEntry = {
                date: new Date(),
                updatedBy: auth.fullName,
                note: `Updated fields: ${changes.map(change => `${change.field} (from "${change.oldValue}" to "${change.newValue}")`).join(", ")}. Note: ${editFields.note}`,
            };

            const updatedJob = {
                ...editFields,
                updatedAt: new Date(),
                updatedBy: auth.fullName,
                history: [...(selectedJob.history || []), historyEntry],
            };

            // Update job in backend
            await axios.put(
                `${URL}/api/job-posts/${selectedJob._id}`,
                updatedJob,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update job list locally
            const updatedJobs = jobs.map((job) =>
                job._id === selectedJob._id ? updatedJob : job
            );

            const emailData = {
                _id: updatedJob._id,
                position: updatedJob.position,
                department: updatedJob.department,
                vacancies: updatedJob.vacancies,
                experience: updatedJob.experience,
                jobLocation: updatedJob.jobLocation,
                postedBy: updatedJob.postedBy,
                description: updatedJob.description,
                status: updatedJob.status,
                toEmail: updatedJob.toEmail,
              };

            await axios.put(
                `${URL}/api/job/approval`,
                emailData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setJobs(updatedJobs);
            // setFilteredJobs(updatedJobs);
            setSelectedJob(null);
            setIsModalVisible(false);
            setIsEditClicked(false);
        } catch (error) {
            console.error("Error updating job details:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderResumeLink = (selectedJob) => {
        if (selectedJob.jd) {
            const downloadLink = `${URL}${selectedJob.jd}`;
            return (
                <a href={downloadLink} target="_blank" rel="noopener noreferrer" style={{ color: "#00B4D2" }}>
                    View JD
                </a>
            );
        } else {
            return "JD not available";
        }
    };

    const handleHistoryClick = (job) => {
        if (job.history) {
            const sortedHistory = job.history.reverse();
            setHistoryData(sortedHistory);
        } else {
            setHistoryData([]);
        }
        setIsDrawerVisible(true);
    };


    return (
        <>
            {loading ? (
                <Spin />
            ) : selectedJob ? (
                <>
                    <div
                        style={{ justifyContent: "space-between", alignItems: "center" }}
                    >
                        <h2
                            style={{
                                fontWeight: "bold",
                                marginRight: "auto",
                                fontSize: "20px",
                                color: "#00B4D2",
                            }}
                        >
                            Job Title:{" "}
                            {isEditClicked ? (
                                <Input
                                    name="position"
                                    value={editFields.position}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                selectedJob.position
                            )}
                        </h2>

                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <div style={{ textTransform: 'capitalize', padding: '5px' }}>
                                {renderResumeLink(selectedJob)}
                            </div>
                            <Button
                                style={{ marginRight: "10px" }}
                                onClick={() => handleHistoryClick(selectedJob)}
                            >
                                History
                            </Button>
                            <h1
                                style={{
                                    fontWeight: "bold",
                                    color: colors[selectedJob.status],
                                    width: "100px",
                                    margin: 0,
                                }}
                            >
                                {isEditClicked ? (
                                    <Select
                                        style={{ width: "100px" }}
                                        key="status"
                                        value={editFields.status}
                                        onChange={(value) =>
                                            setEditFields((prevFields) => ({
                                                ...prevFields,
                                                status: value,
                                            }))
                                        }
                                    >
                                        <Option value="REQ on Hold">REQ on Hold</Option>
                                        <Option value="REQ Approved">REQ Approved</Option>
                                        <Option value="REQ Fullfilled">REQ Fullfilled</Option>
                                    </Select>
                                ) : (
                                    selectedJob.status
                                )}
                            </h1>
                            <Tooltip title="Edit" color="cyan">
                                <button
                                    className="table-btn"
                                    name="edit"
                                    disabled={isEditButtonDisabled}
                                    onClick={() => setIsEditClicked(true)}
                                >
                                    <CiEdit />
                                </button>
                            </Tooltip>
                            {isEditClicked && (
                                <Tooltip title="Save" color="cyan">
                                    <button
                                        className="table-btn"
                                        name="save"
                                        onClick={handleSaveChanges}
                                    >
                                        <AiOutlineCheckCircle />
                                    </button>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                    <Row gutter={16} style={{ marginTop: "30px" }}>
                        <Col span={24}>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <div>
                                        <h3
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "16px",
                                                margin: "5px 0",
                                                color: '#000834',
                                            }}
                                        >
                                            Department:
                                        </h3>
                                        <p>
                                            {isEditClicked ? (
                                                <Input
                                                    name="department"
                                                    value={editFields.department}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                selectedJob.department
                                            )}
                                        </p>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div>
                                        <h3
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "16px",
                                                margin: "5px 0",
                                                color: '#000834',
                                            }}
                                        >
                                            Location:
                                        </h3>
                                        <p>
                                            {isEditClicked ? (
                                                <Input
                                                    name="jobLocation"
                                                    value={editFields.jobLocation}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                selectedJob.jobLocation
                                            )}
                                        </p>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div>
                                        <h3
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "16px",
                                                margin: "5px 0",
                                                color: '#000834',
                                            }}
                                        >
                                            Experience:
                                        </h3>
                                        <p>
                                            {isEditClicked ? (
                                                <Input
                                                    name="experience"
                                                    value={editFields.experience}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                selectedJob.experience
                                            )}
                                        </p>
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <div>
                                        <h3
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "16px",
                                                margin: "5px 0",
                                                color: '#000834',
                                            }}
                                        >
                                            Vacancies:
                                        </h3>
                                        <p>
                                            {isEditClicked ? (
                                                <Input
                                                    name="vacancies"
                                                    value={editFields.vacancies}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                selectedJob.vacancies
                                            )}
                                        </p>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div>
                                        <h3
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "16px",
                                                margin: "5px 0",
                                                color: '#000834',
                                            }}
                                        >
                                            Posted By:
                                        </h3>
                                        <p>
                                            {isEditClicked ? (
                                                <Input
                                                    name="postedBy"
                                                    value={editFields.postedBy}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                selectedJob.postedBy
                                            )}
                                        </p>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div>
                                        <h3
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "16px",
                                                margin: "5px 0",
                                                color: '#000834',
                                            }}
                                        >
                                            Fullfilled By:
                                        </h3>
                                        <p>
                                            {isEditClicked ? (
                                                <DatePicker
                                                    name="fullfilledBy"
                                                    value={
                                                        editFields.fullfilledBy ? moment(editFields.fullfilledBy) : null
                                                    }
                                                    onChange={handleDateChange}
                                                    format="YYYY-MM-DD"
                                                    disabledDate={disabledDate}
                                                />
                                            ) : (
                                                selectedJob.fullfilledBy ? moment(selectedJob.fullfilledBy).format('DD-MM-YYYY') : 'N/A'
                                            )}
                                        </p>
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <div>
                                        <h3
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "16px",
                                                margin: "5px 0",
                                                color: '#000834',
                                            }}
                                        >
                                            Primary Skills:
                                        </h3>
                                        <p>
                                            {isEditClicked ? (
                                                <Input
                                                    name="primarySkills"
                                                    value={editFields.primarySkills}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                selectedJob.primarySkills
                                            )}
                                        </p>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div>
                                        <h3
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "16px",
                                                margin: "5px 0",
                                                color: '#000834',
                                            }}
                                        >
                                            Secondary Skills:
                                        </h3>
                                        <p>
                                            {isEditClicked ? (
                                                <Input
                                                    name="secondarySkills"
                                                    value={editFields.secondarySkills}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                selectedJob.secondarySkills
                                            )}
                                        </p>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div>
                                        <h3
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "16px",
                                                margin: "5px 0",
                                                color: '#000834',
                                            }}
                                        >
                                            Unique Id:
                                        </h3>
                                        <p>
                                            {isEditClicked ? (
                                                <Input
                                                    name="uniqueId"
                                                    value={selectedJob._id}
                                                    onChange={handleInputChange}
                                                    disabled={true}
                                                />
                                            ) : (
                                                selectedJob._id
                                            )}
                                        </p>
                                    </div>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={24}>
                                    <div>
                                        <h3
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "16px",
                                                margin: "5px 0",
                                                color: '#000834',
                                            }}
                                        >
                                            Description:
                                        </h3>
                                        <p>
                                            {isEditClicked ? (
                                                <TextArea
                                                    name="description"
                                                    value={editFields.description}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                selectedJob.description
                                            )}
                                        </p>
                                    </div>
                                </Col>
                            </Row>
                            {isEditClicked && (
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <div>
                                            <h3
                                                style={{
                                                    fontWeight: "bold",
                                                    fontSize: "16px",
                                                    margin: "5px 0",
                                                    color: "red",
                                                }}
                                            >
                                                Reason For This Update:
                                            </h3>
                                            <TextArea
                                                name="note"
                                                value={editFields.note}
                                                placeHolder="Please mention reason for update & what is updated"
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            )}
                        </Col>
                    </Row>
                </>
            ) : (
                <p>No job selected</p>
            )}

            <Drawer
                title="History Data"
                placement="left"
                closable={true}
                onClose={handleDrawerClose}
                open={isDrawerVisible}
                width={400}
            >
                {historyData.length > 0 ? (
                    <List
                        dataSource={historyData}
                        renderItem={(item, index) => (
                            <List.Item key={index}>
                                <List.Item.Meta
                                    title={`Date: ${moment(item.date).format(
                                        "DD MMMM YYYY, HH:mm"
                                    )}`}
                                    description={
                                        <>
                                            <p>Comments: {item.note}</p>
                                            <p>Updated By: {item.updatedBy}</p>
                                        </>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                ) : (
                    <p>No history available</p>
                )}
            </Drawer>
        </>
    )
}

export default ViewJobModal