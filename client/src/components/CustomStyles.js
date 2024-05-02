const CustomStyles = {
  rows: {
    style: {
      backgroundColor: '#fff',
      minHeight: '35px', // Increase the minimum height to align checkboxes with text rows
      lineHeight: '35px',
      ':active': {
        color: 'rgb(8, 8, 68)',
      },
    },
  },
  headCells: {
    style: {
      backgroundColor: 'rgb(8, 8, 68)',
      color: '#FFFF',
    },
  },
  cells: {
    style: {
      height: '35px !important', // Match the row height for consistency
      width: '180px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      padding: '8px', // Add padding to cells for better spacing
    },
  },
  pagination: {
    style: {
      backgroundColor: '#fff',
      height: '30px !important',
      border: 'none',
      color: 'rgba(3, 4, 44, 0.87)',
      display: "flex",
      alignItems: "center",
      minHeight: '30px',
      lineHeight: '30px'
    },
    pageButtonsStyle: {
      border: 'none',
      cursor: 'pointer',
      margin: "0 5px",
      padding: '1px',
      width: '20%',
      color: '#fff !important',
      height: '23px !important',
    },
  },
};

export default CustomStyles;
