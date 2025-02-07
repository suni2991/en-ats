
import React, { useState, useEffect } from 'react';
import { Upload, message, Form, Button } from 'antd';
import axios from 'axios';
import * as XLSX from 'xlsx';

const URL = process.env.REACT_APP_API_URL;

const BulkUpload = () => {

    const [fileList, setFileList] = useState();
    const [uploadedFile, setUploadedFile] = useState();
    const [errorMessagesState, setErrorMessagesState] = useState([]);

    useEffect(() => {

        console.log('Uploaded file: ', uploadedFile);

    }, [uploadedFile]);

    // const beforeUpload = (file) => {
    //     const isValidType = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'text/csv';
    //     if (!isValidType) {
    //         message.error(`${file.name} is not a valid file. Please upload .xlsx or .csv files.`);
    //     }
    //     return isValidType || Upload.LIST_IGNORE;
    // };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            const isValidType =
                file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                file.type === 'text/csv';

            if (!isValidType) {
                message.error(`${file.name} is not a valid file. Please upload .xlsx or .csv files.`);
                setUploadedFile(null);
                return;
            }

            // Read the file
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);

            reader.onload = (event) => {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                // Convert to JSON
                const jsonData = XLSX.utils.sheet_to_json(sheet);
                console.log('jsonData', jsonData);

                // Validate headers
                const requiredHeaders = ["Sr No", "Candidate Name", "Mobile Number", "Email ID"];
                console.log('requiredHeaders', requiredHeaders);

                const fileHeaders = Object.keys(jsonData[0] || {});
                console.log('fileHeaders', fileHeaders);

                const missingHeaders = requiredHeaders.filter(header => !fileHeaders.includes(header));
                console.log('missingHeaders', missingHeaders);

                if (missingHeaders.length > 0) {
                    message.error(`Missing required columns: ${missingHeaders.join(', ')}`);
                    setUploadedFile(null);
                    return;
                }

                // Validate Data
                const srNoRegex = /^[0-9]+$/;
                const nameRegex = /^[A-Za-z\s]+$/;
                const emailRegex = /^[a-zA-Z0-9._%+-]+@(?!enfuse-solutions\.com$)[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
                const contactRegex = /^[0-9]{10}$/;
                const designationRegex = /^[A-Za-z\s]+$/;
                const hrNameRegex = /^[A-Za-z\s]+$/;

                let isValid = true;
                let errorMessages = [];
                // let validRows = [];

                jsonData.forEach((row, index) => {

                    let errors = [];

                    if (!row["Sr No"] || !srNoRegex.test(row["Sr No"])) {
                        errors.push('Invalid Sr No');
                        // errorMessages.push(`Row ${index + 2}: Invalid Sr No, `);
                        isValid = false;
                    }
                    if (!row["Candidate Name"] || !nameRegex.test(row["Candidate Name"])) {
                        errors.push('Invalid Candidate Name');
                        // errorMessages.push(`Row ${index + 2}: Invalid Candiadate Name, `);
                        isValid = false;
                    }
                    if (!row["Mobile Number"] || !contactRegex.test(row["Mobile Number"])) {
                        errors.push('Invalid Mobile Number');
                        // errorMessages.push(`Row ${index + 2}: Invalid Mobile Number, `);
                        isValid = false;
                    }
                    if (!row["Email ID"] || !emailRegex.test(row["Email ID"])) {
                        errors.push('Invalid Email ID');
                        // errorMessages.push(`Row ${index + 2}: Invalid Email, `);
                        isValid = false;
                    }
                    if (!row["Role/Designation"] || !designationRegex.test(row["Role/Designation"])) {
                        errors.push('Invalid Role/Designation');
                        // errorMessages.push(`Row ${index + 2}: Invalid Designation, `);
                        isValid = false;
                    }
                    if (!row["HR Name"] || !hrNameRegex.test(row["HR Name"])) {
                        errors.push('Invalid HR Name');
                        // errorMessages.push(`Row ${index + 2}: Invalid HR Name, `);
                        isValid = false;
                    }

                    if (errors.length > 0) {
                        errorMessages.push(`Row ${index + 2}: ${errors.join(", ")} `);
                        // console.log('Invalid Rows : ', invalidRows);
                    }

                });

                // // Process valid rows
                // if (validRows.length > 0) {
                //     console.log("Valid rows to insert:", validRows);
                //     message.success(`${validRows.length} rows are valid and ready for submission.`);
                // }


                if (errorMessages && errorMessages.length > 0) {
                    setErrorMessagesState(errorMessages);
                } else {
                    setErrorMessagesState(null);
                }


                if (!isValid) {
                    // message.error(errorMessages.join("\n"), 10);
                    setUploadedFile(null);
                    return;
                }

                setUploadedFile(file);
                setErrorMessagesState(null);
                message.success("File uploaded and validated successfully!");

            };

            reader.onerror = () => {
                message.error("Error reading file. Please try again.");
            };
        } else {
            console.log('File selection canceled.');
            setUploadedFile(null);
        }
    }


    // const handleChange = (e) => {
    // console.log("file: ", file);
    // // console.log("fileList: ", fileList);

    // if (file.status === 'removed') {
    //     setUploadedFile(null);
    //     // setFileList([]);
    // } else {
    //     setUploadedFile(file);
    //     // setFileList(fileList);
    // }
    // console.log('e.target:', e.target);


    // if (e.target.files && e.target.files[0]) {
    //     const file = e.target.files[0];
    //     console.log('target.name: ', e.target.name);
    //     console.log('target.files: ', e.target.files);
    //     console.log('target.files[0]: ', e.target.files[0]);
    //     console.log('target.files[0].name: ', e.target.files[0].name);

    //     const isValidType =
    //         file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    //         file.type === 'text/csv';

    //     if (!isValidType) {
    //         message.error(`${file.name} is not a valid file. Please upload .xlsx or .csv files.`);
    //         setUploadedFile(null);
    //         return;
    //     }
    //     setUploadedFile(file);

    // } else {
    //     // Reset state if no file is selected (e.g., user cancels)
    //     console.log('File selection canceled.');
    //     setUploadedFile(null); // Reset the state
    // }

    // if (e.target.name === "xlsx" || e.target.name === "csv") {
    //     const uploadFormData = new FormData();
    //     uploadFormData.append(
    //         e.target.name,
    //         e.target.files[0],
    //         e.target.files[0].name
    //     );
    // }
    // };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!uploadedFile) {
            message.error('No file uploaded. Please upload a valid file before submitting.');
            return;
        }

        const formData = new FormData();
        formData.append('file', uploadedFile); // Attach the file

        try {

            const response = await axios.post(`${URL}/bulk-upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Response:', response.data);
            message.success('File uploaded successfully.');
            console.log('Uploaded file handleSubmit:', uploadedFile);

        } catch (error) {
            console.error('Error uploading file:', error);
        }


        // message.success('File uploaded successfully.');
        // console.log('Uploaded file handleSubmit:', uploadedFile);    

        // if (fileList.length === 0) {
        //     message.error('No file uploaded. Please upload a valid file before submitting.');
        //     return;
        // }
        // message.success('File uploaded successfully.');
        // console.log('Uploaded files:', fileList);

        // if(!fileList){
        //     message.error('No file uploaded. Please upload a valid file before submitting.');
        //     return;
        // }

        // message.success('File uploaded successfully.');
        // console.log('Uploaded files:', fileList);

        // if (!uploadedFile) {
        //     message.error('No file uploaded. Please upload a valid file before submitting.');
        //     return;
        // }

        // message.success('File uploaded successfully.');
        // console.log('Uploaded file:', uploadedFile);
    }

    const handleDownloadTemplate = () => {
        console.log('Download Template.');

        const headers = [
            "Sr No", "Candidate Name", "Mobile Number", "Email ID", "Organisation",
            "Role/Designation", "Total Experience", "Relevant Experience", "Education", "Salary",
            "Expected Salary", "Notice Period/ LWD", "Current Location", "Prefered Location",
            "Resume Status", "Test Applicability", "Test Status", "Test Score",
            "L1 Interviewer", "L1 Interview Status", "L2 Interviewer", "L2 Interview Status",
            "L3 Interviewer", "L3 Interview Status", "Candidate Final Status",
            "HR Comments", "HR Name", "Resume Link"
        ];

        // Create a worksheet with just the headers
        const worksheet = XLSX.utils.aoa_to_sheet([headers]);

        // Create a workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "template");

        // Write the file and trigger download
        XLSX.writeFile(workbook, "Candidate_Template.xlsx");
    }

    // style={{ padding: '70px 15px', display: 'flex', justifyContent: 'center', alignItems: 'center', }}

    return (
        <>
            <div className='fetch-table' style={{ marginTop: '70px', marginLeft: '15px', borderRadius: '8px', width: '97.5%' }} >
                <div style={{ backgroundColor: 'white', padding: '20px' }}>
                    <p style={{ fontSize: '20px', color: 'black', fontWeight: 'bolder', marginLeft: '30%' }}>Upload excel in the bulk below </p>
                    <br />
                    <form>
                        <div style={{ marginLeft: '30%' }}>
                            <input style={{ fontSize: '19px', alignItems: 'center', backgroundColor: 'white', border: '1px solid', marginBottom: '5px', borderRadius: '6px' }} type="file" required onChange={handleChange} accept=".xlsx, .csv" placeholder=".xlsx, .csv" ></input>
                        </div>
                        <div style={{ width: '300px', marginLeft: '32.5%', display: 'flex', justifyContent: 'center' }}>
                            <Button type="submit" className="form-btn" onClick={handleSubmit}>
                                Submit
                            </Button>
                            <Button type="button" className="form-btn" style={{ backgroundColor: '#1a2763' }} onClick={handleDownloadTemplate}>
                                Download Template
                            </Button>
                        </div>
                    </form>
                    <br /><br />
                    <div>
                        {errorMessagesState && errorMessagesState.length > 0 &&
                            <p style={{ fontSize: '18px', color: 'black', marginLeft: '30%' }}>Please rectify the below errors and re-upload the file.</p>
                        }

                        {errorMessagesState && errorMessagesState.length > 0 &&
                            errorMessagesState.map((errorMessage) => (
                                <>
                                    <p style={{ fontSize: '18px', color: 'red', marginLeft: '30%' }}>{errorMessage}</p>
                                </>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )

}

export default BulkUpload;