import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import CustomStyles from './CustomStyles';
import { MdOutlineDownload } from "react-icons/md";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Button } from 'antd';

const Fetchtable = ({ url, columns, title, onViewClick, filteredData }) => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    if (!filteredData) {
      const fetchData = async () => {
        try {
          const response = await axios.get(url);
          setData(response.data.reverse());
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    } else {
      setData(filteredData);
    }
  }, [url, filteredData]);

  const handleView = (row) => {
    if (onViewClick) {
      onViewClick(row);
    }
  };

  const handleViewButtonClick = () => {
    if (selectedRow) {
      console.log('Selected row:', selectedRow);
      handleView(selectedRow);
    } else {
      console.log('No row selected.');
    }
  };

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
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'data.xlsx');
  };

  return (
    <div className='fetch-table'>
      <div className='search-cont'>
        <input
          type="text"
          placeholder="Search by FullName/ Job Title or Location"
          value={searchQuery}
          onChange={handleSearch}
          style={{ float: 'left', width: '50%' }}
        />
        <Button 
          style={{ background: 'a', margin: '0px',color: '#FFF', float: 'right' }} 
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
