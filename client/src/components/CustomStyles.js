const customStyles = {
  rows: {
    style: {
      backgroundColor: '#fff',
      minHeight: '30px',
      lineHeight: '30px',
      display: 'flex',
      alignItems: 'center',
      ':active': {
        color: '#00B4D2',
      },
    },
  },
  headCells: {
    style: {
      backgroundColor: '#1a2763',
      color: 'white',
      borderRight: '1px solid #000000',
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',

      fontWeight: 'bolder',

    },
  },
  cells: {
    style: {
      height: '30px !important',
      width: '180px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      borderRight: '1px solid #000000',
      whiteSpace: 'nowrap',
      padding: '10px',
      textAlign: 'left',
      display: 'flex',

    },
  },
  pagination: {
    style: {
      backgroundColor: '#fff',
      height: '30px !important',
      border: 'none',
      color: 'rgba(3, 4, 44, 0.87)',
      display: 'flex',
      alignItems: 'center',
      minHeight: '30px',
      lineHeight: '30px',
    },
    pageButtonsStyle: {
      border: 'none',
      cursor: 'pointer',
      margin: '0 5px',
      padding: '1px',
      width: '20%',
      color: '#fff !important',
      height: '23px !important',
    },
  },
};

export default customStyles;
