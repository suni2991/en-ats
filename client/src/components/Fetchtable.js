import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import CustomStyles from './CustomStyles';

const Fetchtable = ({ url, columns, title, onViewClick }) => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [url]);

  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows);
  };

  const isRowSelected = (row) => {
    return selectedRows.some(selectedRow => selectedRow._id === row._id);
  };

  const handleView = (row) => {
    if (onViewClick) {
      onViewClick(row);
    }
  };

  const handleViewButtonClick = () => {
    if (selectedRows.length > 0) {
      console.log('Selected rows:', selectedRows);
      handleView(selectedRows[0]);
    } else {
      console.log('No rows selected.');
    }
  };

  return (
    <div>
      <DataTable
        title={title}
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        striped
        customStyles={CustomStyles}
        selectableRows
        onSelectedRowsChange={handleRowSelected}
        selectedRows={selectedRows}
        fixedheader
      />
    </div>
  );
};

export default Fetchtable;
