
import React, { useState, useEffect } from 'react';
import { Upload, message, Form, Button } from 'antd';
import axios from 'axios';

const URL = process.env.REACT_APP_API_URL;

const BulkUpload = () => {

    const [fileList, setFileList] = useState();
    const [uploadedFile, setUploadedFile] = useState();

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


        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            console.log('target.name: ', e.target.name);
            console.log('target.files: ', e.target.files);
            console.log('target.files[0]: ', e.target.files[0]);
            console.log('target.files[0].name: ', e.target.files[0].name);

            const isValidType =
                file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                file.type === 'text/csv';

            if (!isValidType) {
                message.error(`${file.name} is not a valid file. Please upload .xlsx or .csv files.`);
                setUploadedFile(null);
                return;
            }
            setUploadedFile(file);

        } else {
            // Reset state if no file is selected (e.g., user cancels)
            console.log('File selection canceled.');
            setUploadedFile(null); // Reset the state
        }

        // if (e.target.name === "xlsx" || e.target.name === "csv") {
        //     const uploadFormData = new FormData();
        //     uploadFormData.append(
        //         e.target.name,
        //         e.target.files[0],
        //         e.target.files[0].name
        //     );
        // }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!uploadedFile) {
            message.error('No file uploaded. Please upload a valid file before submitting.');
            return;
        }

        const formData = new FormData();
        formData.append('file', uploadedFile); // Attach the file

        try {

            const response = await axios.post(`${URL}/bulk-upload`, formData,  {
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

    return (
        <>
            <div style={{ padding: '70px 15px', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', }}>
                    <p style={{ fontSize: '20px', color: 'black', fontWeight: 'bolder' }}>Upload excel in the bulk below </p>
                    <br />
                    <form>
                        <div>
                            <input style={{ fontSize: '19px', alignItems: 'center', backgroundColor: 'white', border: '1px solid', marginBottom: '5px', borderRadius: '6px' }} type="file" required onChange={handleChange} accept=".xlsx, .csv" placeholder=".xlsx, .csv" ></input>
                        </div>
                        <Button type="submit" className="form-btn" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </form>
                </div>
            </div>
        </>
    )

}

export default BulkUpload;