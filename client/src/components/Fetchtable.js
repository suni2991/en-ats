import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import CustomStyles from './CustomStyles';
import { MdOutlineDownload } from "react-icons/md";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Button } from 'antd';

// Utility function to capitalize the first letter of each word
const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const token = process.env.REACT_APP_JWT_TOKEN

const Fetchtable = ({ url, columns, title, onViewClick, filteredData, extraContent }) => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    if (!filteredData) {
      const fetchData = async () => {
        try {
          const response = await axios.get(url,
            {
              headers:{
                Authorization: `Bearer ${token}`
              }
            });
          setData(response.data.reverse());
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    } else {
      setData(filteredData.reverse());
    }
  }, [url, filteredData]);



  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredResults = data.filter((item) => {
    const query = searchQuery.toLowerCase();
    const fullName = item.fullName ? item.fullName.toLowerCase() : '';
    const position = item.position ? item.position.toLowerCase() : '';
    const location = item.location ? item.location.toLowerCase() : '';
    const postedBy = item.postedBy ? item.postedBy.toLowerCase() : '';
    const role = item.role ? item.role.toLowerCase() : '';
    const selectedCategory = item.selectedCategory ? item.selectedCategory.toLowerCase() : '';
    return (
      fullName.includes(query) ||
      position.includes(query) ||
      postedBy.includes(query) ||
      role.includes(query) ||
      location.includes(query) ||
      selectedCategory.includes(query)
    );
  });

  const filterDataForExport = (dataToFilter) => {
    return dataToFilter.map(({ _id, __v, ...rest }) => rest);
  };

  const handleExportToExcel = (dataToExport) => {
    const filteredData = filterDataForExport(dataToExport);

    const capitalizedHeaders = Object.keys(filteredData[0] || {}).reduce((acc, key) => {
      acc[capitalizeWords(key.replace(/_/g, ' '))] = key;
      return acc;
    }, {});

    const formattedData = filteredData.map(item => {
      return Object.keys(item).reduce((acc, key) => {
        acc[capitalizeWords(key.replace(/_/g, ' '))] = item[key];
        return acc;
      }, {});
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'data.xlsx');
  };

  return (
    <div className='fetch-table'>
      <div className='search-cont'>
        {extraContent && <div style={{ float: 'left' }}>{extraContent}</div>}
        <input
          type="text"
          placeholder="Search by FullName/ Job Title or Location"
          value={searchQuery}
          onChange={handleSearch}
          style={{ float: 'left', width: '50%', padding: '6px', margin: '2px' }}
        />
        <Button 
          style={{ background: '#A60808', margin: '0px', color: '#FFF', float: 'right' }} 
          onClick={() => handleExportToExcel(filteredResults.length ? filteredResults : data)}
        >
          <MdOutlineDownload /> Download Excel
        </Button>
      </div>
      <DataTable
        title={title}
        columns={columns}
        data={filteredResults}
        pagination
        highlightOnHover
        striped
        customStyles={CustomStyles}
        onRowClicked={(row) => setSelectedRow(row)}
      />
    </div>
  );
};

export default Fetchtable;
