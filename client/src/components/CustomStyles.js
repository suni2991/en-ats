// const CustomStyles = {
//   rows: {
//     style: {
//       backgroundColor: '#fff',
//       minHeight: '35px', // Increase the minimum height to align checkboxes with text rows
//       lineHeight: '35px',
//       ':active': {
//         color: 'rgb(8, 8, 68)',
//       },
//     },
//   },
//   headCells: {
//     style: {
//       backgroundColor: 'rgb(8, 8, 68)',
//       color: '#FFFF',
//       alignItems: 'left'
//     },
//   },
//   cells: {
//     style: {
//       height: '35px !important', // Match the row height for consistency
//       width: '180px',
//       overflow: 'hidden',
//       textOverflow: 'ellipsis',
//       whiteSpace: 'nowrap',
//       padding: '8px', // Add padding to cells for better spacing
//     },
//   },
//   pagination: {
//     style: {
//       backgroundColor: '#fff',
//       height: '30px !important',
//       border: 'none',
//       color: 'rgba(3, 4, 44, 0.87)',
//       display: "flex",
//       alignItems: "center",
//       minHeight: '30px',
//       lineHeight: '30px'
//     },
//     pageButtonsStyle: {
//       border: 'none',
//       cursor: 'pointer',
//       margin: "0 5px",
//       padding: '1px',
//       width: '20%',
//       color: '#fff !important',
//       height: '23px !important',
//     },
//   },
// };

// export default CustomStyles;
const customStyles = {
  rows: {
    padding: '12px',
    style: {
      minHeight: '30px',
      lineHeight: '30px',
      backgroundColor: '#fff',
      ':hover': {
        backgroundColor: '#00B4D2',
        color: '#fff',
        fontWeight: 'bold',
        borderRadius: 'none',
      },
      ':active': {
        backgroundColor: '#00B4D2',
        color: '#fff',
      },
    },
  },
  headCells: {
    style: {
      backgroundColor: '#28325A',
      color: '#FFFF',
      padding: '2px 0px 2px 0px',
      height: '40px !important',
      fontWeight: 'bolder'
    },
  },
  cells: {
    style: {
      padding: '8px',
      width: "100px",
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      alignItems: 'center'
    },
  },
  pagination: {
    style: {
      backgroundColor: '#28325A',
      border: 'none',
      color: '#fff',
      display: "flex",
      alignItems: "center",
      minHeight: '30px',
      lineHeight: '30px'
    },
    pageButtonsStyle: {
      backgroundColor: '#fff',
      border: 'none',
      cursor: 'pointer',
      margin: "0 5px",
      padding: '1px',
      width: '20%',
      height: '23px !important',
      ':hover': {
        backgroundColor: '#00B4D2',
        color: 'rgb(14, 157, 157)',
      },
      ':active': {
        backgroundColor: '#8C8C8C',
        color: '#333',
      },
    },
  },
};

export default customStyles;